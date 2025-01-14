from io import BytesIO
from PIL import Image, ImageOps
import logging
import boto3
from .core.tool import Tool
import os
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY
from .binary_request_message import BinaryParameters

LOGGER = logging.getLogger(__name__)

class BinaryTool(Tool):

    def __init__(
            self,
    ) -> None: 
        """
        Initialize the BinaryTool with the path to the binary image.

        Args:
            threshold (float): Threshold level of binarization (From what RGB of the original it should apply) (0 to 255).
        """

        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY, #vem do ficheiro config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )

    
    def apply(self, parameters: BinaryParameters):
        """
        Apply the binarization to the input image and save the result.

        Args:
            parameters (BinaryParameters): binary parameters.
        """
        # Parse input and output bucket/key from URIs
        input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
        output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)
        threshold = parameters.threshold  # Threshold value (0-255)


        # Download the input image from MinIO
        LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
        input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
        input_image = Image.open(BytesIO(input_obj['Body'].read()))

        # Convert image to grayscale
        grayscale_image = input_image.convert("L")  # L mode is grayscale
        binarized_image = grayscale_image.point(lambda p: 255 if p > threshold else 0, mode="1")

        # Convert back to RGB for saving
        final_image = binarized_image.convert("RGB")

        LOGGER.info("Uploading processed image to MinIO: %s/%s", output_bucket, output_key)
        buffer = BytesIO()
        final_image.save(buffer, format="JPEG")  # Adjust format if needed
        buffer.seek(0)

        self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
        LOGGER.info("Binarization changed successfully and image saved to MinIO.")


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
