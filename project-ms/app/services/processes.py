from app.models.process import Process
from app.db import db
import uuid

class ProcessService:

    @staticmethod
    def get_process_by_id(process_id):
        """
        Fetch a process by ID.
        :param process_id: The ID of the process.
        :return: The Process object if found, else None.
        """
        return Process.query.filter_by(id=process_id).first().to_dict()

    @staticmethod
    def get_process_by_id_and_project(process_id, project_id):
        """
        Fetch a process by ID.
        :param process_id: The ID of the process.
        :param project_id: The ID of the project associated to the process.
        :return: The Process object if found, else None.
        """
        return Process.query.filter_by(id=process_id, project_id=project_id).first().to_dict()
    
    @staticmethod
    def create_process(proj_id, num_images):
        """
        Create a new process for a given project.
        :param proj_id: ID of the project (UUID)
        :param num_images: Total number of images to process
        :return: Created process as a dictionary
        """
        # Validate proj_id as a UUID
        try:
            uuid.UUID(proj_id)  # Raises ValueError if invalid
        except ValueError:
            raise ValueError(f"Invalid proj_id: {proj_id}")

        # Create and save the process
        process = Process(project_id=proj_id, total=num_images)
        process.save()
        return process.to_dict()
    
    @staticmethod
    def update_process(project_id, process_id, increment_by=1):
        """
        Update the progress of a process if it belongs to the project.
        :param project_id: UUID of the project
        :param process_id: UUID of the process
        :param increment_by: Number of steps to increment the completed count (default is 1)
        :return: Updated process as a dictionary or None if not found/unauthorized
        """
        process = Process.query.filter_by(id=process_id, project_id=project_id).first()
        if not process:
            return None  # Process not found or not refering to the project

        try:
            process.increment_progress(count=increment_by)
        except Exception as e:
            raise Exception(f"Error updating the process '{process_id}'")
        
        return process.to_dict()

    @staticmethod
    def stop_process(process_id):
        """
        Update the stop of a process, which will lead to a stop of the thread executing the process.
        :param process_id: UUID of the process
        :return: Updated process as a dictionary or None if not found/unauthorized
        """
        process = Process.query.filter_by(id=process_id).first()
        if not process:
            return None  # Process not found

        try:
            process.stop = True
            process.save()
        except ValueError as e:
            # Handle the error gracefully if increment exceeds total
            return {"error": str(e)}
        
        return process.to_dict()