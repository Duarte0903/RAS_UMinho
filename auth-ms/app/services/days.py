from app.models.days import Day
from app.db import db
from datetime import date
import logging, sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),  # Log to stdout
    ]
)
LOGGER = logging.getLogger(__name__)

class DayService:
    @staticmethod
    def get_day_record(user_id, operation_date=None):
        """
        Retrieve a day's record for a user.
        :param user_id: ID of the user
        :param operation_date: Date of the operations (defaults to today)
        :return: The day's record as a dictionary, or None if not found
        """
        if operation_date is None:
            operation_date = date.today()

        day_record = Day.query.filter_by(user_id=user_id, operation_date=operation_date).first()
        return day_record.to_dict() if day_record else None

    @staticmethod
    def increment_operations(user_id):
        """
        Increment the operations count for a user on a specific day.
        Ensures the user does not exceed their daily limit.
        :param user_id: ID of the user
        :return: Updated day's record as a dictionary or an error message
        """
        LOGGER.info("11")
        operation_date = date.today()
        LOGGER.info("12")
        day_record = Day.query.filter_by(user_id=user_id, operation_date=operation_date).first()
        LOGGER.info("13")

        if not day_record:
            # Create a new day record if it doesn't exist
            day_record = Day(user_id=user_id, operation_date=operation_date, operations_count=1)
            LOGGER.info("14")
            day_record.save()
            LOGGER.info("15")
            return day_record.to_dict()

        LOGGER.info("16")
        # Increment the operation count
        day_record.operations_count += 1
        LOGGER.info("17")
        day_record.save()
        LOGGER.info("18")
        return day_record.to_dict()
