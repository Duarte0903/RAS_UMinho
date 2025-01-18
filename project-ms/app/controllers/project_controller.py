import json
import uuid
from flask import request, jsonify
from app.services.projects import ProjectService
from app.utils.jwt_utils import decode_jwt
from app.utils.minio_utils import create_project_buckets
from app.services.tools import ToolService
from app.utils.minio_utils import *
from app.utils.rabbitmq_utils import submit_task
import pika
import logging
from app.services.images import ImageService  # Ensure this is at the top

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Set the desired log level
class ProjectController:

    @staticmethod
    def get_projects_by_user():
        # Extract JWT from the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT to get the user_id
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")
        except Exception as e:
            return {"success": False, "error": "Error decoding token!"}, 401

        # Call the service to fetch projects
        try:
            projects = ProjectService.get_projects_by_user(user_id)
            return {"success": True, "projects": projects}
        except Exception as e:
            return {"success": False, "error": "Error accessing data!"}, 500

    @staticmethod
    def add_project():
        # Extract JWT from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode JWT to get the user_id
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # 'sub' contains the user ID
        except Exception as e:
            return {"success": False, "error": str(e)}, 401

        # Get project data from the request body
        data = request.get_json()
        if not data or 'name' not in data:
            return {"success": False, "error": "Project name is required"}, 400

        # Call the service to create the project
        try:
            project = ProjectService.create_project(name=data['name'], user_id=user_id)

            # Create MinIO buckets for the project
            try:
                buckets = create_project_buckets(project['id'])  # Utilizes the utility function
            except Exception as e:
                return {"success": False, "error": str(e)}, 500

            return {"success": True, "project": project}, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
        
    @staticmethod
    def update_project(project_id):
        # Extract JWT from the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT to get the user_id
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # 'sub' contains the user ID
        except Exception as e:
            return {"success": False, "error": str(e)}, 401

        # Get new name from the request body
        data = request.get_json()
        if not data or 'name' not in data:
            return {"success": False, "error": "Project name is required"}, 400

        # Call the service to update the project
        try:
            updated_project = ProjectService.update_project_name(
                project_id=project_id,
                user_id=user_id,
                new_name=data['name']
            )
            if updated_project:
                return {"success": True, "project": updated_project}, 200
            else:
                return {"success": False, "error": "Project not found or not owned by user"}, 404
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
        
    @staticmethod
    def delete_project(project_id):
        # Extract JWT from the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT to get the user_id
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # 'sub' contains the user ID
        except Exception as e:
            return {"success": False, "error": str(e)}, 401

        # Call the service to delete the project
        try:
            deleted = ProjectService.delete_project(project_id=project_id, user_id=user_id)
            if deleted:
                return {"success": True, "message": "Project deleted successfully"}, 200
            else:
                return {"success": False, "error": "Project not found or not owned by user"}, 404
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
        
    @staticmethod
    def process_project(project_id):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            logger.error("Authorization header is missing or invalid")
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")
            logger.info(f"Decoded JWT for user_id: {user_id}")
        except Exception as e:
            logger.error("Error decoding token: %s", str(e))
            return {"success": False, "error": str(e)}, 401

        try:
            project = ProjectService.get_project_by_id_and_user(project_id, user_id)
            if not project:
                logger.warning(f"Project {project_id} not found or not owned by user {user_id}")
                return {"success": False, "error": "Project not found or not owned by user"}, 404

            logger.info(f"Processing project {project_id} for user {user_id}")
            tools = ToolService.get_tools_by_project(project_id)
            if not tools:
                logger.warning(f"No tools defined for project {project_id}")
                return {"success": False, "error": "No tools defined for this project"}, 400

            tools = sorted(tools, key=lambda t: t["position"])
            logger.info(f"Tools sorted by position: {tools}")
            src_bucket = f"{project_id}-src"
            out_bucket = f"{project_id}-out"
            logger.info(f"Source bucket: {src_bucket}, Output bucket: {out_bucket}")

            # List images in the source bucket
            try:
                images = list_objects_in_bucket(src_bucket)
                logger.info(f"Found {len(images)} images in source bucket: {images}")
            except Exception as e:
                logger.error(f"Failed to list images in bucket {src_bucket}: {str(e)}")
                return {"success": False, "error": f"Error accessing source bucket: {str(e)}"}, 500

            for image in images:
                logger.info(f"Starting processing for image: {image}")
                input_image = image
                intermediate_images = []

                for idx, tool in enumerate(tools):
                    logger.info(f"Processing with tool: {tool['procedure']} at position {idx + 1}")
                    output_file_name = f"{uuid.uuid4()}.jpg"
                    output_image = f"{out_bucket}/{output_file_name}"
                    task_id = str(uuid.uuid4())
                
                    logger.info(f"Generated output filename: {output_file_name}")
                    logger.info(f"Submitting task {task_id} for input: {input_image} to output: {output_image}")
                
                    try:
                        submit_task(tool, input_image, output_image, project_id, task_id)
                    except Exception as e:
                        logger.error(f"Error submitting task {task_id}: {str(e)}")
                        return {"success": False, "error": f"Error submitting task: {str(e)}"}, 500
                
                    logger.info(f"Waiting for task completion for task_id: {task_id}")
                    if not ProjectController.wait_for_task_completion(task_id):
                        logger.error(f"Task {task_id} failed or timed out for image {input_image}")
                        return {"success": False, "error": f"Task {task_id} failed or timed out."}, 500
                
                    # Log and debug intermediate outputs
                    logger.debug(f"Intermediate output: {output_image}")
                    if idx > 0:
                        intermediate_images.append(input_image)
                
                    input_image = output_image  # Update input for next tool


                # Create a database entry for the processed image
                output_image_id = str(uuid.uuid4())
                logger.info(f"Creating database entry for processed image: {output_image_id}")
                try:
                    ImageService.create_image(
                        image_id=output_image_id,
                        project_id=project_id,
                        uri=output_image,
                    )
                except Exception as e:
                    logger.error(f"Error saving processed image {output_image_id} to database: {str(e)}")
                    return {"success": False, "error": f"Error saving processed image: {str(e)}"}, 500

                logger.info(f"Cleaning up intermediate images for {image}")
                for img in intermediate_images:
                    try:
                        bucket_name, object_name = img.split("/", 1)
                        logger.debug(f"Deleting intermediate image: {img}")
                        delete_object(bucket_name, object_name)
                    except Exception as e:
                        logger.error(f"Error deleting intermediate image {img}: {e}")

            logger.info(f"Processing completed successfully for project {project_id}")
            return {"success": True, "message": "Project processing completed successfully"}, 200

        except Exception as e:
            logger.error(f"Failed to process project {project_id}: {str(e)}")
            return {"success": False, "error": f"Failed to process project: {str(e)}"}, 500


    @staticmethod
    def wait_for_task_completion(task_id, timeout=30):
        """
        Wait for a task to complete by listening to the RabbitMQ 'results' queue.

        Args:
            task_id (str): The unique identifier for the task.
            timeout (int): The maximum time to wait for a response in seconds.

        Returns:
            bool: True if the task completed successfully, False otherwise.
        """
        connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
        channel = connection.channel()
    
        result_queue = "results"  # The shared results queue
        task_status = {"success": False}

        def callback(ch, method, properties, body):
            try:
                response = json.loads(body)
                if response.get("correlationId") == task_id:
                    task_status["success"] = response.get("status") == "success"
                    channel.stop_consuming()  # Stop consuming when the task is done
            except Exception as e:
                print(f"Error in callback: {e}")

        try:
            channel.basic_consume(queue=result_queue, on_message_callback=callback, auto_ack=True)
            channel.start_consuming()
        except Exception as e:
            print(f"Timeout or interruption occurred while waiting for task completion: {e}")

        connection.close()
        return task_status["success"]


    @staticmethod
    def get_project_by_id(project_id):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401
    
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # Extract user ID from token
        except Exception as e:
            return {"success": False, "error": str(e)}, 401
    
        try:
            # Verify if the project belongs to the user
            project = ProjectService.get_project_by_id_and_user(project_id, user_id)
            if not project:
                return {"success": False, "error": "Project not found or not owned by user"}, 404
    
            # Serialize the project object
            project_dict = project.to_dict()  # Assuming `to_dict` is implemented on the Project model
            return {"success": True, "project": project_dict}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
