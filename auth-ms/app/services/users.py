from app.models.users import User
from app.db import db
import uuid
from app.utils.hashing_utils import verify_password 

class UserService:
    @staticmethod
    def get_user_by_id(user_id):
        """
        Retrieve a user by their ID.
        :param user_id: UUID of the user
        :return: User as a dictionary or None if not found
        """
        user = User.query.filter_by(id=user_id).first()
        return user.to_dict() if user else None

    @staticmethod
    def create_user(name, email, password_hash):
        """
        Create a new user.
        :param name: Name of the user
        :param email: Email address of the user
        :param password_hash: Hashed password of the user
        :return: Created user as a dictionary
        """
        if User.query.filter_by(email=email).first():
            raise ValueError("Email already exists")

        user = User(name=name, email=email, password_hash=password_hash)
        user.save()
        return user.to_dict(exclude_password=True)

    @staticmethod
    def update_user_name(user_id, new_name):
        """
        Update the name of a user.
        :param user_id: UUID of the user
        :param new_name: New name of the user
        :return: Updated user as a dictionary or None if not found
        """
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return None
        
        user.name = new_name
        user.save()
        return user.to_dict(exclude_password=True)

    @staticmethod
    def update_user_email(user_id, new_email):
        """
        Update the email of a user.
        :param user_id: UUID of the user
        :param new_email: New email address
        :return: Updated user as a dictionary or None if not found
        """
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return None

        if User.query.filter_by(email=new_email).first():
            raise ValueError("Email already exists")

        user.email = new_email
        user.save()
        return user.to_dict(exclude_password=True)

    @staticmethod
    def update_user_password(user_id, new_password_hash):
        """
        Update the password of a user.
        :param user_id: UUID of the user
        :param new_password_hash: New hashed password
        :return: Updated user as a dictionary or None if not found
        """
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return None

        user.password_hash = new_password_hash
        user.save()
        return user.to_dict(exclude_password=True)

    @staticmethod
    def delete_user(user_id):
        """
        Delete a user by their ID.
        :param user_id: UUID of the user
        :return: True if the user was deleted, False otherwise
        """
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return False

        db.session.delete(user)
        db.session.commit()
        return True

    @staticmethod
    def get_all_users():
        """
        Retrieve all users.
        :return: List of users as dictionaries
        """
        users = User.query.all()
        return [user.to_dict(exclude_password=True) for user in users]

    @staticmethod
    def authenticate_user(email, password):
        """
        Authenticate a user by their email and plain-text password.
        :param email: Email address of the user
        :param password: Plain-text password
        :return: User as a dictionary or None if authentication fails
        """
        user = User.query.filter_by(email=email).first()
        if user and verify_password(password, user.password_hash):
            return user.to_dict(exclude_password=True)
        return None

    
    @staticmethod
    def update_user_type(user_id, new_type):
        """
        Update the type of a user.
        :param user_id: UUID of the user
        :param new_type: New type for the user (e.g., 'gratuito', 'premium')
        :return: Updated user as a dictionary or None if not found
        """
        valid_types = ["gratuito", "premium"]
        if new_type not in valid_types:
            raise ValueError(f"Invalid user type: {new_type}. Valid types are: {valid_types}")

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return None

        user.type = new_type
        user.save()
        return user.to_dict(exclude_password=True)
