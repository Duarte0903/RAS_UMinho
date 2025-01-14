from app.db import db
from app.models.image import Image

class ImageService:
    @staticmethod
    def create_image(image_id, project_id, uri):
        """
        Create a new image entry in the database.
        :param image_id: UUID of the image.
        :param project_id: UUID of the associated project.
        :param uri: URI of the image in MinIO.
        :return: The created image object.
        """
        image = Image(id=image_id, project_id=project_id, uri=uri)
        image.save()
        return image

    @staticmethod
    def get_image_by_id(image_id, project_id):
        """
        Get an image entry by its ID and project ID.
        :param image_id: The ID of the image.
        :param project_id: The ID of the project the image belongs to.
        :return: The Image object or None if not found.
        """
        return Image.query.filter_by(id=image_id, project_id=project_id).first()

    @staticmethod
    def delete_image_by_id(image_id):
        """
        Delete an image entry by its ID.
        :param image_id: The ID of the image to delete.
        :raises Exception: If deletion fails.
        """
        image = Image.query.filter_by(id=image_id).first()
        if not image:
            raise Exception(f"Image with ID '{image_id}' not found")

        db.session.delete(image)
        db.session.commit() 