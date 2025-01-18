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

    @staticmethod
    def get_images_by_project(project_id):
        """
        Retrieve all processed image links from the output bucket for a project.
        :param project_id: The ID of the project.
        :return: A list of pre-signed URLs for the project's processed images.
        """
        out_bucket = f"{project_id}-out"
        try:
            image_links = get_output_image_links(out_bucket)
            return image_links
        except Exception as e:
            raise Exception(f"Failed to retrieve images for project '{project_id}': {str(e)}")


    @staticmethod
    def get_images_by_project_and_bucket(project_id, bucket_name):
        """
        Retrieve all images associated with a project and bucket from the database.
        :param project_id: The UUID of the project.
        :param bucket_name: The name of the bucket (source or output).
        :return: A list of image records as dictionaries.
        """
        try:
            images = (
                Image.query.filter(
                    Image.project_id == project_id,
                    Image.uri.like(f"{bucket_name}/%")  # Match URIs starting with the bucket name
                ).all()
            )
            return [
                {
                    "image_id": str(img.id),  # Ensure UUID is serialized as a string
                    "uri": img.uri,
                    "project_id": str(img.project_id)  # Include project_id for context
                }
                for img in images
            ]
        except Exception as e:
            raise Exception(f"Failed to retrieve images for bucket '{bucket_name}': {str(e)}")
    
    