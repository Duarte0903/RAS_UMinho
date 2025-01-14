from io import BytesIO
from PIL import Image
import logging
import boto3

from .core.tool import Tool
from .rotation_request_message import RotationParameters
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY

LOGGER = logging.getLogger(__name__)

class RotationTool(Tool):

    def __init__(self, default_rotation_angle: float = 90, default_rotation_expand: bool = True) -> None:
        """
        Initialize the RotationTool with default rotation angle and expand option.

        Args:
            default_rotation_angle (float): Default angle for rotation.
            default_rotation_expand (bool): Default expand option for the canvas.
        """
        self.default_rotation_angle = default_rotation_angle
        self.default_rotation_expand = default_rotation_expand

        # MinIO client setup
        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY,  # From config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )

    def apply(self, parameters: RotationParameters):
        """
        Rotate the input image by the specified angle and save the result to MinIO.

        Args:
            parameters (RotationParameters): Parameters including input and output image URIs,
                                              rotation angle, and expand option.
        """
        try:
            # Get rotation angle and expand option from parameters, falling back to defaults
            angle = parameters.angle or self.default_rotation_angle
            expand = parameters.expand if parameters.expand is not None else self.default_rotation_expand

            # Parse input and output bucket/key from URIs
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)

            # Download the input image from MinIO
            LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read()))

            # Rotate the image
            LOGGER.info("Rotating the image by %s degrees (expand=%s).", angle, expand)
            rotated_image = input_image.rotate(angle, expand=expand)

            # Save the processed image to MinIO
            LOGGER.info("Uploading rotated image to MinIO: %s/%s", output_bucket, output_key)
            buffer = BytesIO()
            rotated_image.save(buffer, format="JPEG")  # Adjust format if needed
            buffer.seek(0)

            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
            LOGGER.info("Rotation applied successfully and image saved to MinIO.")

        except Exception as e:
            LOGGER.error("Error rotating image or uploading to MinIO: %s", e)
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
