from io import BytesIO
from PIL import Image, ImageOps
import logging
import boto3
from .core.tool import Tool
import os
from .bezel_request_message import  BezelParameters
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY

LOGGER = logging.getLogger(__name__)

class BezelTool(Tool):

    def __init__(self, default_bezel_color: str = "black", default_bezel_thickness: int = 10) -> None:
        """
        Initialize the BezelTool with default bezel color and thickness.

        Args:
            default_bezel_color (str): Default color of the bezel (e.g., "red", "#000000", (255, 255, 255)).
            default_bezel_thickness (int): Default thickness of the bezel in pixels.
        """
        self.default_bezel_color = default_bezel_color
        self.default_bezel_thickness = default_bezel_thickness

        # MinIO client setup
        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY, #vem do ficheiro config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )

    def apply(self, parameters: BezelParameters):
        """
        Apply a bezel (border) to the input image and save the result to MinIO.

        Args:
            parameters (BezelParameters): Parameters including input and output image URIs,
                                          bezel color, and bezel thickness.
        """
        try:
            # Get bezel color and thickness from parameters, falling back to defaults
            bezel_color = parameters.bezelColor or self.default_bezel_color
            bezel_thickness = parameters.bezelThickness or self.default_bezel_thickness

            # Parse input and output bucket/key from URIs
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)

            # Download the input image from MinIO
            LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read()))

            # Add bezel using ImageOps.expand
            LOGGER.info("Applying bezel to the image.")
            image_with_bezel = ImageOps.expand(
                input_image, border=bezel_thickness, fill=bezel_color
            )

            # Save the processed image to MinIO
            LOGGER.info("Uploading processed image to MinIO: %s/%s", output_bucket, output_key)
            buffer = BytesIO()
            image_with_bezel.save(buffer, format="JPEG")  # Adjust format if needed
            buffer.seek(0)

            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
            LOGGER.info("Bezel added successfully and image saved to MinIO.")
        
        except Exception as e:
            LOGGER.error("Error adding bezel or uploading to MinIO: %s", e)
            raise

    @staticmethod
    def parse_s3_uri(uri):
        """
        Parse a URI into bucket and key by splitting on '/'.

        Args:
            uri (str): URI in the format 'bucket/key'.

        Returns:
            tuple: (bucket, key)
        """
        parts = uri.split("/", 1)  # Split into bucket and key
        if len(parts) != 2:
            raise ValueError(f"Invalid URI format: {uri}")

        bucket, key = parts
        return bucket, key
