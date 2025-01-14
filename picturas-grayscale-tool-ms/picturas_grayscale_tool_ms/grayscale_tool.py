from io import BytesIO
from PIL import Image, ImageOps
import logging
import boto3
from .core.tool import Tool
import os
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY
from .grayscale_request_message import GrayScaleParameters

LOGGER = logging.getLogger(__name__)

class GrayScaleTool(Tool):

    def __init__(self) -> None: 
        """
        Initialize the GrayScaleTool.

        Sets up the connection to the MinIO client.
        """
        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY,  # vem do ficheiro config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )
    
    def apply(self, parameters: GrayScaleParameters):
        """
        Convert the input image to grayscale and save the result to MinIO.

        Args:
            parameters (ImageToGrayParameters): Parameters including input and output image URIs.
        """
        try:
            # Parse input and output bucket/key from URIs
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)

            # Download the input image from MinIO
            LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read()))

            # Convert the image to grayscale
            LOGGER.info("Converting image to grayscale.")
            grayscale_image = input_image.convert("L")  # Convert to grayscale (8-bit pixels)

            # Save the grayscale image to a buffer
            buffer = BytesIO()
            grayscale_image.save(buffer, format="JPEG")  # Save in JPEG format
            buffer.seek(0)

            # Upload the grayscale image to MinIO
            LOGGER.info("Uploading processed image to MinIO: %s/%s", output_bucket, output_key)
            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
            LOGGER.info("Grayscale conversion successful and image saved to MinIO.")

        except Exception as e:
            LOGGER.error("Error processing image to grayscale: %s", e)
            raise


    @staticmethod
    def parse_s3_uri(s3_uri):
        """
        Parse an S3 URI into bucket and key.

        Args:
            s3_uri (str): S3 URI (e.g., s3://bucket/key).

        Returns:
            tuple: (bucket, key)
        """
        if not s3_uri.startswith("s3://"):
            raise ValueError(f"Invalid S3 URI: {s3_uri}")
        _, _, bucket, *key_parts = s3_uri.split("/")
        return bucket, "/".join(key_parts)