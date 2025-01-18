from flask import request, Response
from app.services.projects import ProjectService
from app.services.images import ImageService
from app.utils.jwt_utils import decode_jwt
from app.utils.minio_utils import *
import uuid

import logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

minio_client = Minio(
    "minio:9000",
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False  # Set to True if using HTTPS
)
class ImageController:
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
    MAX_FILE_SIZE_MB = 5

    @staticmethod
    def upload_image(project_id):
        logger.debug(f"Received headers: {dict(request.headers)}")

        # Extract and validate Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            logger.error("Authorization header is missing or invalid")
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode JWT
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")
            logger.debug(f"Decoded user_id: {user_id}")
        except Exception as e:
            logger.error(f"JWT decoding failed: {e}")
            return {"success": False, "error": str(e)}, 401

        # Verify project ownership
        project = ProjectService.get_project_by_id_and_user(project_id, user_id)
        if not project:
            logger.error(f"Project {project_id} not found or not owned by user {user_id}")
            return {"success": False, "error": "Project not found or not owned by user"}, 404

        # Validate file
        logger.debug(f"Received files: {request.files.keys()}")
        if 'file' not in request.files:
            logger.error("No file provided in the request")
            return {"success": False, "error": "No file provided"}, 400

        file = request.files['file']
        logger.debug(f"File name: {file.filename}, Content type: {file.content_type}")

        if file.filename == '':
            logger.error("File name is empty")
            return {"success": False, "error": "File name cannot be empty"}, 400

        if file.filename.split('.')[-1].lower() not in ImageController.ALLOWED_EXTENSIONS:
            logger.error("Unsupported file type")
            return {"success": False, "error": "Unsupported file type"}, 400

        if len(file.read()) > ImageController.MAX_FILE_SIZE_MB * 1024 * 1024:
            logger.error("File size exceeds the maximum allowed limit")
            return {"success": False, "error": "File size exceeds the maximum allowed limit"}, 400

        file.seek(0)  # Reset file pointer

        # Upload file
        src_bucket = f"{project_id}-src"
        try:
            # Check for duplicate filenames in the bucket
            original_filename = file.filename
            extension = original_filename.split('.')[-1]
            name_without_extension = '.'.join(original_filename.split('.')[:-1])
            unique_filename = f"{name_without_extension}_{uuid.uuid4().hex}.{extension}"

            # Upload file with the unique filename
            upload_file_to_bucket(src_bucket,file,unique_filename)

            # Generate URI and add to the database
            file_uri = f"{src_bucket}/{unique_filename}"
            image_id = str(uuid.uuid4())
            ImageService.create_image(image_id=image_id, project_id=project_id, uri=file_uri)

            logger.info(f"File '{original_filename}' uploaded successfully as '{unique_filename}'")
            return {
                "success": True,
                "message": f"File '{original_filename}' uploaded successfully",
                "image_id": image_id,
                "uri": file_uri,
            }, 201
        except Exception as e:
            logger.error(f"File upload failed: {e}")
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


    @staticmethod
    def get_images(project_id):
        """
        GET: Retrieve all original and processed image data (URLs and metadata) for a project's buckets.
        """
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

        # Define the source and output bucket names
        src_bucket = f"{project_id}-src"
        out_bucket = f"{project_id}-out"

        try:
            # Retrieve original images metadata from the database
            original_images_metadata = ImageService.get_images_by_project_and_bucket(project_id, src_bucket)
            original_images = []
            for image in original_images_metadata:
                original_images.append({
                    "image_id": image["image_id"],
                    "filename": image["uri"].split("/")[-1],
                    "uri": image["uri"],
                    "url": f"https://p.primecog.com/api/images/{src_bucket}/{image['uri'].split('/')[-1]}"
                })

            # Retrieve processed images metadata from the database
            processed_images_metadata = ImageService.get_images_by_project_and_bucket(project_id, out_bucket)
            processed_images = []
            for image in processed_images_metadata:
                processed_images.append({
                    "image_id": image["image_id"],
                    "filename": image["uri"].split("/")[-1],
                    "uri": image["uri"],
                    "url": f"https://p.primecog.com/api/images/{out_bucket}/{image['uri'].split('/')[-1]}"
                })

            # Return both original and processed images with their metadata
            return {
                "success": True,
                "original_images": original_images,
                "processed_images": processed_images,
            }, 200
        except Exception as e:
            logger.error(f"Error fetching images: {e}")
            return {"success": False, "error": str(e)}, 500





    @staticmethod
    def serve_image(bucket, filename):
        """
        Serve an image from MinIO through the backend.
        """
        try:
            # Fetch the image from MinIO
            response = minio_client.get_object(bucket, filename)
            # Stream the image to the client
            return Response(
                response,
                content_type=response.getheader("Content-Type")
            )
        except S3Error as e:
            logger.error(f"Failed to retrieve image '{filename}' from bucket '{bucket}': {e}")
            return {"error": f"Failed to retrieve image: {str(e)}"}, 404