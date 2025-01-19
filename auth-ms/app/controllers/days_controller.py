from flask import request, jsonify
from app.services.days import DayService
from app.utils.jwt_utils import decode_jwt, generate_jwt

class DayController:
    @staticmethod
    def get_day_record():
        """
        Fetch the daily operations record for a user.
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")
        except Exception:
            return {"success": False, "error": "Invalid or expired token"}, 401

        # Fetch the day's record
        try:
            day_record = DayService.get_day_record(user_id)
            if not day_record:
                return {"success": False, "message": "No record for today"}, 404
            return {"success": True, "day_record": day_record}, 200
        except Exception:
            return {"success": False, "error": "Error fetching record"}, 500

    @staticmethod
    def increment_operations():
        """
        Increment the user's operations count for today, respecting the daily limit.
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        # Decode the JWT
        token = auth_header.split(" ")[1]
        try:
            payload = decode_jwt(token)
            user_id = payload.get("sub")
            user_type = payload.get("type")  # Fetch the user type to determine the limit
        except Exception:
            return {"success": False, "error": "Invalid or expired token"}, 401

        # Define daily limits based on user type
        limits = {
            "anônimo": 5,
            "gratuito": 10,
            "premium": float("inf")  # Unlimited for premium users
        }
        max_operations = limits.get(user_type, 5)  # Default to `anônimo` limit

        # Increment operations
        try:
            result = DayService.increment_operations(user_id, max_operations)
            if "error" in result:
                return {"success": False, "error": result["error"]}, 403

            # Generate a new JWT token
            token = generate_jwt(user_id=user_id, user_type=user_type, num_processes=result.operations_count)
            return {"success": True, "day_record": result, "token": token}, 200
        except Exception:
            return {"success": False, "error": "Error incrementing operations"}, 500
