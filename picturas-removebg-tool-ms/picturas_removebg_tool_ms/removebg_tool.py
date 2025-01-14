from io import BytesIO
import rembg
import numpy as np
from PIL import Image
import logging
import boto3
from .core.tool import Tool
import os
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY
from .removebg_request_message import RemovebgParameters

LOGGER = logging.getLogger(__name__)

class RemovebgTool(Tool):

    def __init__(self) -> None: 
        """
        Initialize the RemovebgTool.

        Args:
            threshold (float): Threshold level of binarization (From what RGB of the original it should apply) (0 to 255).
        """

        # MinIO client setup
        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY, #vem do ficheiro config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )

    
    def apply(self, parameters: RemovebgParameters):
        """
        Apply the rembg to the input image and save the result.
    
        Args:
            parameters (RemovebgParameters): removebg parameters.
        """
        try:
            # Parse input and output bucket/key from URIs
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)
    
            # Download the input image from MinIO
            LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read()))
    
            # Convert the input image to a numpy array
            input_array = np.array(input_image)
    
            # Removing background using rembg
            LOGGER.info("Removing Background from the image.")
            output_array = rembg.remove(input_array)
    
            # Create a PIL Image from the output array
            final_image = Image.fromarray(output_array)
    
            # If the image has an alpha channel (RGBA), convert it to RGB
            if final_image.mode == "RGBA":
                final_image = final_image.convert("RGB")
    
            # Save the processed image to MinIO
            LOGGER.info("Uploading processed image to MinIO: %s/%s", output_bucket, output_key)
            buffer = BytesIO()
            final_image.save(buffer, format="JPEG")  # Adjust format if needed
            buffer.seek(0)
    
            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
            LOGGER.info("Background removed successfully and image saved to MinIO.")
    
        except Exception as e:
            LOGGER.error("Error removing background or uploading to MinIO: %s", e)
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
