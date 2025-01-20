from flask import request
from app.services.projects import ProjectService
from app.utils.jwt_utils import decode_jwt
from app.utils.minio_utils import create_project_buckets
from app.utils.minio_utils import *
import logging

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
            return {"success": True, "projects": projects}, 200
        except Exception as e:
            return {"success": False, "error": "Error accessing data!"}, 500

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
    def delete_projects_user():
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

        # Call the service to delete the user's projects
        try:
            deleted = ProjectService.delete_projects_user(user_id=user_id)
            if deleted:
                return {"success": True, "message": "Projects deleted successfully"}, 200
            else:
                # Return true even if there were no projects to delete
                return {"success": False, "error": "No projects owned by user found to delete"}, 404
        except Exception as e:
            return {"success": False, "error": str(e)}, 500
