import json
import uuid
from flask import request
from app.services.projects import ProjectService
from app.services.processes import ProcessService
from app.utils.jwt_utils import decode_jwt
from app.services.tools import ToolService
from app.utils.minio_utils import *
from app.utils.rabbitmq_utils import submit_task
import pika
import logging
from app.services.images import ImageService  # Ensure this is at the top
from threading import Thread
from flask import current_app

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Set the desired log level
class ProcessController:
    
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

        logger.info(f"Processing project {project_id} for user {user_id}")
        project = ProjectService.get_project_by_id_and_user(project_id, user_id)
        if not project:
            logger.warning(f"Project {project_id} not found or not owned by user {user_id}")
            return {"success": False, "error": "Project not found"}, 404

        tools = ToolService.get_tools_by_project(project_id)
        if not tools:
            logger.info(f"No tools defined for project {project_id}")
            return {"success": True, "message": "No tools defined. Process done."}, 200

        tools = sorted(tools, key=lambda t: t["position"])
        src_bucket = f"{project_id}-src"
        out_bucket = f"{project_id}-out"

        images = list_objects_in_bucket(src_bucket)
        if len(images) == 0:
            logger.info(f"No images defined for project {project_id}")
            return {"success": True, "message": "No images defined. Process done."}, 200
        
        # Call the service to create the process
        try:
            process = ProcessService.create_process(proj_id=project_id, num_images=len(images))
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

        def background_task(app_context):
            # Use the Flask application context in the thread
            with app_context:
                try:
                    for image in images:
                        # Verificar se pediu para parar o processo
                        process = ProcessService.get_process_by_id(process.id)
                        if process.stop:
                            logger.info(f"Process stopped by user for project {project_id}")
                            return

                        input_image = image
                        intermediate_images = []

                        for idx, tool in enumerate(tools):
                            output_file_name = f"{uuid.uuid4()}.jpg"
                            output_image = f"{out_bucket}/{output_file_name}"
                            task_id = str(uuid.uuid4())

                            submit_task(tool, input_image, output_image, project_id, task_id)

                            if not ProcessController.wait_for_task_completion(task_id):
                                logger.error(f"Task {task_id} failed or timed out for image {input_image}")
                                return

                            if idx > 0:
                                intermediate_images.append(input_image)

                            input_image = output_image

                        output_image_id = str(uuid.uuid4())
                        ImageService.create_image(
                            image_id=output_image_id,
                            project_id=project_id,
                            uri=output_image,
                        )

                        for img in intermediate_images:
                            bucket_name, object_name = img.split("/", 1)
                            delete_object(bucket_name, object_name)
                        
                        # Atualizar progresso do processo
                        ProcessService.update_process(
                            project_id=project_id,
                            process_id=process.id,
                            increment_by=1
                        )

                    logger.info(f"Processing completed successfully for project {project_id}")
                except Exception as e:
                    logger.error(f"Failed to process project {project_id}: {str(e)}")
        
        # Pass the current app context to the thread
        app_context = current_app._get_current_object().app_context()
        thread = Thread(target=background_task, args=(app_context,))
        thread.start()

        # Return immediately
        return {
            "success": True,
            "message": "Project processing started successfully",
            "process": process
        }, 202

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
    def get_process_status(project_id, process_id):
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

        project = ProjectService.get_project_by_id_and_user(project_id, user_id)
        if not project:
            logger.warning(f"Project {project_id} not found or not owned by user {user_id}")
            return {"success": False, "error": "Project not found"}, 404
        
        process = ProcessService.get_process_by_id_and_project(process_id, project_id)
        if not process:
            logger.warning(f"Process not found with id {process_id}")
            return {"success": False, "error": "Process not found"}, 404

        return {"success": True, "process": process}, 200

    @staticmethod
    def cancel_process(project_id, process_id):
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

        project = ProjectService.get_project_by_id_and_user(project_id, user_id)
        if not project:
            logger.warning(f"Project {project_id} not found or not owned by user {user_id}")
            return {"success": False, "error": "Project not found"}, 404

        process = ProcessService.get_process_by_id_and_project(process_id, project_id)
        if not process:
            logger.warning(f"Process not found with id {process_id}")
            return {"success": False, "error": str(e)}, 404
        
        # Update the `stop` field of the process
        try:
            process = ProcessService.stop_process(process_id)
            logger.info(f"Process {process_id} for project {project_id} successfully canceled.")
            return {"success": True, "message": "Process successfully canceled", "process": process}, 200
        except Exception as e:
            logger.error(f"Failed to cancel process {process_id}: {str(e)}")
            return {"success": False, "error": "Failed to update process stop field"}, 500
