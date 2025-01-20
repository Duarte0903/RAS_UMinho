from flask import request, jsonify
from app.services.days import DayService
from app.utils.jwt_utils import decode_jwt, generate_jwt
import logging, sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),  # Log to stdout
    ]
)
LOGGER = logging.getLogger(__name__)

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
        Increment the user's operations count for today.
        """
        LOGGER.info("1")
        auth_header = request.headers.get("Authorization")
        LOGGER.info("1.1")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"success": False, "error": "Authorization header is missing or invalid"}, 401

        LOGGER.info("2")
        token = auth_header.split(" ")[1]
        try:
            LOGGER.info("3")
            payload = decode_jwt(token)
            LOGGER.info("4")
            user_id = payload.get("sub")
            LOGGER.info("5")
            user_type = payload.get("type")
            LOGGER.info("6")
        except Exception as e:
            return {"success": False, "error": str(e)}, 402

        # Increment operations
        try:
            result = DayService.increment_operations(user_id)
            LOGGER.info("7")
            if "error" in result:
                return {"success": False, "error": result["error"]}, 403

            LOGGER.info("8")
            # Generate a new JWT token
            token = generate_jwt(user_id=user_id, user_type=user_type, num_processes=result["operations_count"])
            LOGGER.info("9")
            return {"success": True, "day_record": result, "token": token}, 200
        except Exception as e:
            LOGGER.info("erro %s", str(e))
            return {"success": False, "error": "Error incrementing operations"}, 500
