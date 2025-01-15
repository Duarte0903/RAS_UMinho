from flask import request, jsonify
from app.services.users import UserService
from app.utils.jwt_utils import decode_jwt, generate_jwt
from app.utils.hashing_utils import hash_password, verify_password  # Utility for password hashing and verification


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
    def update_user_name():
        """
        Update a user's name.
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

        # Get the new name from the request body
        data = request.get_json()
        if not data or "name" not in data:
            return {"success": False, "error": "New name is required"}, 400

        try:
            updated_user = UserService.update_user_name(user_id, data["name"])
            if not updated_user:
                return {"success": False, "error": "User not found"}, 404
            return {"success": True, "user": updated_user}, 200
        except ValueError as e:
            return {"success": False, "error": str(e)}, 400
        except Exception:
            return {"success": False, "error": "Error updating name"}, 500

    @staticmethod
    def update_user_email():
        """
        Update a user's email.
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

        # Get the new email from the request body
        data = request.get_json()
        if not data or "email" not in data:
            return {"success": False, "error": "New email is required"}, 400

        try:
            updated_user = UserService.update_user_email(user_id, data["email"])
            if not updated_user:
                return {"success": False, "error": "User not found"}, 404
            return {"success": True, "user": updated_user}, 200
        except ValueError as e:
            return {"success": False, "error": str(e)}, 400
        except Exception:
            return {"success": False, "error": "Error updating email"}, 500

    @staticmethod
    def update_user_password():
        """
        Update a user's password.
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

        # Get the new password from the request body
        data = request.get_json()
        if not data or "password" not in data:
            return {"success": False, "error": "New password is required"}, 400

        try:
            # Hash the new password
            hashed_password = hash_password(data["password"])

            updated_user = UserService.update_user_password(user_id, hashed_password)
            if not updated_user:
                return {"success": False, "error": "User not found"}, 404
            return {"success": True, "user": updated_user}, 200
        except Exception:
            return {"success": False, "error": "Error updating password"}, 500

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

            # Generate a JWT token
            token = generate_jwt(user_id=user["id"], user_type=user["type"])
            return {"success": True, "user": user, "token": token}, 200
        except Exception:
            return {"success": False, "error": "Authentication failed"}, 500


    @staticmethod
    def update_user_type():
        """
        Update the type of a user.
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
            return {"success": True, "user": updated_user}, 200
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
