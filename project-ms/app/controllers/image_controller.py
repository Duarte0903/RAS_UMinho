from flask import request
from app.services.projects import ProjectService
from app.services.images import ImageService
from app.utils.jwt_utils import decode_jwt
from app.utils.minio_utils import *
import uuid

class ImageController:
    @staticmethod
    def upload_image(project_id):
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

        # Verify project ownership
        project = ProjectService.get_project_by_id_and_user(project_id, user_id)
        if not project:
            return {"success": False, "error": "Project not found or not owned by user"}, 404

        # Handle file upload
        if 'file' not in request.files:
            return {"success": False, "error": "No file provided"}, 400

        file = request.files['file']
        if file.filename == '':
            return {"success": False, "error": "File name cannot be empty"}, 400

        # Define the source bucket name
        src_bucket = f"{project_id}-src"

        # Upload file to MinIO
        try:
            upload_file_to_bucket(src_bucket, file)

            # Generate a URI for the image
            file_uri = f"{src_bucket}/{file.filename}"

            # Add entry to the Images table
            image_id = str(uuid.uuid4())  # Generate a unique UUID for the image
            ImageService.create_image(image_id=image_id, project_id=project_id, uri=file_uri)

            return {
                "success": True,
                "message": f"File '{file.filename}' uploaded successfully",
                "image_id": image_id,
                "uri": file_uri
            }, 201
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    @staticmethod
    def get_images(project_id):
        # Extract JWT from Authorization header
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

        # Verify project ownership
        project = ProjectService.get_project_by_id_and_user(project_id, user_id)
        if not project:
            return {"success": False, "error": "Project not found or not owned by user"}, 404

        # Define the output bucket name
        out_bucket = f"{project_id}-out"

        # List objects in the bucket
        try:
            image_links = get_output_image_links(out_bucket)
            return {"success": True, "images": image_links}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
        


    @staticmethod
    def delete_image(project_id, image_id):
        # Extract JWT from Authorization header
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

        # Verify project ownership
        project = ProjectService.get_project_by_id_and_user(project_id, user_id)
        if not project:
            return {"success": False, "error": "Project not found or not owned by user"}, 404

        # Get image details from the database
        image = ImageService.get_image_by_id(image_id, project_id)
        if not image:
            return {"success": False, "error": f"Image with ID '{image_id}' not found in project '{project_id}'"}, 404

        # Delete file from MinIO and the database
        try:
            # Extract file name from URI
            file_name = image.uri.split("/")[-1]

            # Delete from MinIO
            delete_file_from_bucket(f"{project_id}-src", file_name)

            # Delete the image entry from the database
            ImageService.delete_image_by_id(image_id)

            return {"success": True, "message": f"Image '{image_id}' deleted successfully"}, 200
        except Exception as e:
            return {"success": False, "error": str(e)}, 500