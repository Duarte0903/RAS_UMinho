from PIL import Image, ImageEnhance

from .core.tool import Tool
from .brightness_contrast_request_message import BrightnessContrastParameters
from io import BytesIO
import logging
import boto3
from .core.tool import Tool
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY

LOGGER = logging.getLogger(__name__)

class BrightnessContrastTool(Tool):

    def __init__(
        self, 
        default_brightness: float = 1.0, 
        default_contrast: float = 1.0,
    ) -> None:
        """
        Initialize the ResizeTool with default resize width and height.

        Args:
            default_brightness (float): Default brightness of the filter (e.g., 0.2, 0.8, 1.2).
            default_contrast (float): Default contrast of the filter.
        """
        self.default_brightness = default_brightness
        self.default_contrast = default_contrast
        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY, #vem do ficheiro config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )

    def apply(self, parameters: BrightnessContrastParameters):
        """
        Apply a filter (brightness/contrast change) to the input image and save the result.

        Args:
            parameters (BrightnessContrastParameters): Parameters including input and output image URIs,
                                          brightness and contrast values.
        """
        try:
            # Get resize width and height from parameters, falling back to defaults
            brightness = parameters.brightness or self.default_brightness
            contrast = parameters.contrast or self.default_contrast
            new_filter = (
                float(brightness),
                float(contrast)
            )

            # Open the input image
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)

            # Download the input image from MinIO
            LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read()))

            # Aplica brilho
            enhancer = ImageEnhance.Brightness(input_image)
            final_image = enhancer.enhance(brightness)
            
            # Aplica contraste
            enhancer = ImageEnhance.Contrast(final_image)
            final_image = enhancer.enhance(contrast)

            # Save the output image
            LOGGER.info("Uploading processed image to MinIO: %s/%s", output_bucket, output_key)
            buffer = BytesIO()
            final_image.save(buffer, format="JPEG")  # Adjust format if needed
            buffer.seek(0)

            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
            LOGGER.info("Brightness changed successfully and image saved to MinIO.")

        except Exception as e:
            print(f"Error applying filter: {e}")


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
