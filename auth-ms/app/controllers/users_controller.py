from flask import request, jsonify
from app.services.users import UserService
from app.services.days import DayService
from app.utils.jwt_utils import decode_jwt, generate_jwt
from app.utils.hashing_utils import hash_password, verify_password  # Utility for password hashing and verification
import random, string, uuid
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),  # Log to stdout
    ]
)
LOGGER = logging.getLogger(__name__)

class UserController:
    @staticmethod
    def get_user():
        """
        Fetch user information by decoding the JWT.
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # 'sub' contains the user ID
        except Exception:
            return {"success": False, "error": "Invalid or expired token"}, 401

        # Call the service to fetch user details
        user = UserService.get_user_by_id(user_id)
        if not user:
            return {"success": False, "error": "User not found"}, 404

        return {"success": True, "user": user}, 200


    @staticmethod
    def create_user():
        """
        Create a new user with hashed password.
        """
        data = request.get_json()
        if not data or "name" not in data or "email" not in data or "password" not in data:
            return {"success": False, "error": "Name, email and password are required"}, 400
    
        try:
            # Hash the password
            hashed_password = hash_password(data["password"])
    
            # Create the user
            user = UserService.create_user(
                name=data["name"],
                email=data["email"],
                password_hash=hashed_password
            )
            return {"success": True, "user": user}, 201
        except ValueError as e:
            return {"success": False, "error": str(e)}, 400
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            return {
                "success": False,
                "error": "Error creating user",
                "details": error_details
            }, 500

    @staticmethod
    def update_user():
        """
        Update a user's details (except 'type').
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT to get the user_id
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # 'sub' contains the user ID
        except Exception:
            return {"success": False, "error": "Invalid or expired token"}, 401

        # Get the new details from the request body
        data = request.get_json()
        if not data or "name" not in data or "email" not in data or "oldPassword" not in data or "newPassword" not in data:
            return {"success": False, "error": "New name, email and oldPassword and newPassword are required"}, 400

        try:
            # Verify if the oldPassword matches the password in the database
            oldPassword = UserService.get_password_by_id(user_id)
            if not oldPassword:
                return {"success": False, "error": "User not found"}, 404

            if not verify_password(data["oldPassword"], oldPassword):  # Assuming verify_password compares plaintext with the stored hash
                return {"success": False, "error": "Old password is incorrect"}, 403

            # Hash the new password
            hashed_password = hash_password(data["newPassword"])

            updated_user = UserService.update_user(user_id, data["name"], data["email"], hashed_password)
            
            if not updated_user:
                return {"success": False, "error": "User not found"}, 404
            return {"success": True, "user": updated_user}, 200
        except ValueError as e:
            return {"success": False, "error": str(e)}, 400
        except Exception as ex:
            return {"success": False, "error": f"Error updating user: {str(ex)}"}, 500

    @staticmethod
    def authenticate_user():
        """
        Authenticate a user and return a JWT token.
        """
        data = request.get_json()
        if not data or "email" not in data or "password" not in data:
            return {"success": False, "error": "Email and password are required"}, 400

        try:
            # Retrieve the user
            user = UserService.authenticate_user(data["email"], data["password"])
            if not user:
                return {"success": False, "error": "Invalid email or password"}, 401
            user["id"] = str(user["id"])

            # Get operations count
            operations_count = 0
            day_record = DayService.get_day_record(user["id"])
            if day_record:
                operations_count = day_record["operations_count"]
                
            # Generate a JWT token
            token = generate_jwt(user_id=user["id"], user_type=user["type"], num_processes=operations_count)
            return {"success": True, "user": user, "token": token}, 200
        except Exception:
            return {"success": False, "error": "Authentication failed"}, 500
    
    @staticmethod
    def authenticate_user_anonimo():
        """
        Authenticate an anonimous user and return a JWT token for his session.
        """
        try:
            # Mock the data
            mock_name = "Anonimo"
    
            # Generate a highly unique random email
            random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
            unique_id = uuid.uuid4().hex[:8]  # Get a unique 8-character string from a UUID
            mock_email = f"{random_string}.{unique_id}@example.com"
    
            mock_hashed_password = hash_password("password")
    
            # Create the user
            user = UserService.create_user_anonimo(
                name=mock_name,
                email=mock_email,
                password_hash=mock_hashed_password
            )
            if not user:
                return {"success": False, "error": "Error creating anonimous user"}, 401
            user["id"] = str(user["id"])
    
            # Generate a JWT token
            token = generate_jwt(user_id=user["id"], user_type=user["type"], num_processes=0)
            return {"success": True, "user": user, "token": token}, 200
        except Exception:
            return {"success": False, "error": "Authentication of anonimous user failed"}, 500


    @staticmethod
    def update_user_type():
        """
        Update the type of a user and return a new JWT token.
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT to get the user_id
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # 'sub' contains the user ID
        except Exception:
            return {"success": False, "error": "Invalid or expired token"}, 401

        # Get the new type from the request body
        data = request.get_json()
        if not data or "type" not in data:
            return {"success": False, "error": "New type is required"}, 400

        try:
            updated_user = UserService.update_user_type(user_id, data["type"])
            if not updated_user:
                return {"success": False, "error": "User not found"}, 404
            updated_user["id"] = str(updated_user["id"])
            
            # Get operations count
            operations_count = 0
            day_record = DayService.get_day_record(user_id)
            if day_record:
                operations_count = day_record["operations_count"]
                
            # Generate a JWT token
            token = generate_jwt(user_id=updated_user["id"], user_type=updated_user["type"], num_processes=operations_count)
            return {"success": True, "user": updated_user, "token": token}, 200
        except ValueError as e:
            return {"success": False, "error": str(e)}, 400
        except Exception:
            return {"success": False, "error": "Error updating user type"}, 500
    
    @staticmethod
    def delete_user():
        """
        Delete the current user's account.
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT to get the user_id
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")  # 'sub' contains the user ID
        except Exception:
            return {"success": False, "error": "Invalid or expired token"}, 401

        try:
            # Attempt to delete the user
            is_deleted = UserService.delete_user(user_id)
            if not is_deleted:
                return {"success": False, "error": "User not found"}, 404
            return {"success": True, "message": "User deleted successfully"}, 200
        except Exception:
            return {"success": False, "error": "Error deleting user"}, 500
