from minio import Minio
from minio.error import S3Error
from ..config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY
import os
from datetime import timedelta

# Initialize MinIO client
minio_client = Minio(
    "minio:9000",  
    access_key=MINIO_ACCESS_KEY,  
    secret_key=MINIO_SECRET_KEY,  
    secure=False  # Set to True if using HTTPS
)

def create_project_buckets(project_id):
    """
    Create MinIO buckets for the project.

    :param project_id: The ID of the project (used for bucket names).
    :return: List of created bucket names or raise an exception on failure.
    """
    src_bucket = f"{project_id}-src"
    out_bucket = f"{project_id}-out"

    try:
        # Create the source bucket
        if not minio_client.bucket_exists(src_bucket):
            minio_client.make_bucket(src_bucket)

        # Create the output bucket
        if not minio_client.bucket_exists(out_bucket):
            minio_client.make_bucket(out_bucket)

        return [src_bucket, out_bucket]
    except S3Error as e:
        raise Exception(f"Failed to create buckets: {str(e)}")


def upload_file_to_bucket(bucket_name, file):
    """
    Upload a file to a MinIO bucket.

    :param bucket_name: The name of the bucket.
    :param file: The file object (from Flask request).
    :raises Exception: If upload fails.
    """
    try:
        file_name = file.filename
        content_type = file.content_type
        file.seek(0, os.SEEK_END)  # Move the pointer to the end of the file
        file_size = file.tell()  # Get the size of the file
        file.seek(0)  # Reset the pointer to the beginning of the file

        # Upload the file with size specified
        minio_client.put_object(
            bucket_name=bucket_name,
            object_name=file_name,
            data=file.stream,
            length=file_size,
            content_type=content_type
        )
    except S3Error as e:
        raise Exception(f"Failed to upload file: {str(e)}")


def list_objects_in_bucket(bucket_name):
    """
    List all objects in the specified MinIO bucket and return their paths prefixed with the bucket name.

    :param bucket_name: The name of the bucket.
    :return: A list of paths in the format 'bucket_name/object_name'.
    :raises Exception: If bucket listing fails.
    """
    try:
        objects = minio_client.list_objects(bucket_name, recursive=True)
        # Prepend bucket name to each object name
        file_paths = [f"{bucket_name}/{obj.object_name}" for obj in objects]
        return file_paths
    except S3Error as e:
        raise Exception(f"Failed to list objects in bucket: {str(e)}")


def delete_file_from_bucket(bucket_name, file_name):
    """
    Delete a file from the specified MinIO bucket.

    :param bucket_name: The name of the bucket.
    :param file_name: The name of the file to delete.
    :raises Exception: If the deletion fails.
    """
    try:
        minio_client.remove_object(bucket_name, file_name)
    except S3Error as e:
        raise Exception(f"Failed to delete file: {str(e)}")


def get_output_image_links(bucket_name):
    """
    List all objects in the specified MinIO bucket and generate pre-signed URLs.

    :param bucket_name: The name of the bucket.
    :return: A list of pre-signed URLs for the objects in the bucket.
    :raises Exception: If bucket listing fails.
    """
    try:
        objects = minio_client.list_objects(bucket_name, recursive=True)
        urls = []
        for obj in objects:
            # Generate a pre-signed URL for each object
            url = minio_client.presigned_get_object(
                bucket_name,
                obj.object_name,
                expires=timedelta(hours=2)  # Expires in 2 hour
            )
            urls.append(url)
        return urls
    except S3Error as e:
        raise Exception(f"Failed to list objects in bucket: {str(e)}")
    
def delete_object(bucket_name, object_name):
    """
    Delete an object from the specified MinIO bucket.

    :param bucket_name: The name of the bucket.
    :param object_name: The name of the object to delete.
    :raises Exception: If deletion fails.
    """
    try:
        minio_client.remove_object(bucket_name, object_name)
        print(f"Deleted object '{object_name}' from bucket '{bucket_name}'")
    except S3Error as e:
        raise Exception(f"Error deleting object '{object_name}' from bucket '{bucket_name}': {e}")
