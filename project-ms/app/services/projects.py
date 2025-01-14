from app.models.project import Project
from app.db import db
import uuid

class ProjectService:
    @staticmethod
    def get_projects_by_user(user_id):
        # Use SQLAlchemy ORM to query the Projects table
        projects = Project.query.filter_by(user_id=user_id).all()
        return [project.to_dict() for project in projects]
    @staticmethod
    def create_project(name, user_id):
        """
        Create a new project for a given user.
        :param name: Name of the project
        :param user_id: ID of the user (UUID)
        :return: Created project as a dictionary
        """
        # Validate user_id as a UUID
        try:
            uuid.UUID(user_id)  # Raises ValueError if invalid
        except ValueError:
            raise ValueError(f"Invalid user_id: {user_id}")

        # Create and save the project
        project = Project(name=name, user_id=user_id)
        project.save()
        return project.to_dict()

    @staticmethod
    def update_project_name(project_id, user_id, new_name):
        """
        Update the name of a project if it belongs to the user.
        :param project_id: UUID of the project
        :param user_id: UUID of the user
        :param new_name: New name for the project
        :return: Updated project as a dictionary or None if not found/unauthorized
        """
        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return None  # Project not found or not owned by the user

        project.name = new_name
        project.save()
        return project.to_dict()
    

    @staticmethod
    def delete_project(project_id, user_id):
        """
        Delete a project if it belongs to the user.
        :param project_id: UUID of the project
        :param user_id: UUID of the user
        :return: True if the project was deleted, False otherwise
        """
        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return False  # Project not found or not owned by the user

        project.delete()
        return True
    
    @staticmethod
    def get_project_by_id_and_user(project_id, user_id):
        """
        Fetch a project by ID and verify ownership.
        :param project_id: The ID of the project.
        :param user_id: The ID of the user.
        :return: The Project object if found and owned by the user, else None.
        """
        return Project.query.filter_by(id=project_id, user_id=user_id).first()