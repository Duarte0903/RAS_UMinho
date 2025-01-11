import random
from io import BytesIO
from PIL import Image, ImageEnhance
import logging
import boto3
from .core.tool import Tool
from .watermark_request_message import WatermarkParameters
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY

LOGGER = logging.getLogger(__name__)

class WatermarkTool(Tool):
    def __init__(self, watermark_image_path: str, opacity: float = 0.7) -> None:
        """
        Initialize the WatermarkTool with the path to the watermark image.

        Args:
            watermark_image_path (str): Path to the watermark image.
            opacity (float): Transparency level of the watermark (0.0 to 1.0).
        """
        self.opacity = opacity

        # MinIO client setup
        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY,
            aws_secret_access_key=MINIO_SECRET_KEY,
        )

        # Load the watermark image
        self.watermark_image = Image.open(watermark_image_path).convert("RGBA")

    def _apply_opacity(self, image: Image.Image) -> Image.Image:
        """
        Adjust the opacity of the watermark image.
        """
        alpha = image.split()[3]
        alpha = ImageEnhance.Brightness(alpha).enhance(self.opacity)
        image.putalpha(alpha)
        return image

    def apply(self, parameters: WatermarkParameters):
        """
        Apply the watermark with an overlay effect to the input image and save the result.
    
        Args:
            parameters (WatermarkParameters): watermark parameters.
        """
        try:
            # Parse S3 bucket and key
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)
    
            LOGGER.info("Downloading input image from S3: bucket=%s, key=%s", input_bucket, input_key)
            # Download the input image
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read())).convert("RGBA")
    
            # Resize and adjust the watermark's opacity
            watermark = self.watermark_image.copy()
            smallest_dimension = min(input_image.size)
            scale_factor = smallest_dimension * 0.3
            new_watermark_size = (
                int(watermark.size[0] * scale_factor / smallest_dimension),
                int(watermark.size[1] * scale_factor / smallest_dimension),
            )
            watermark = watermark.resize(new_watermark_size)
            watermark = self._apply_opacity(watermark)
    
            # Generate random position for the watermark
            random_x = random.randint(0, max(0, input_image.size[0] - new_watermark_size[0]))
            random_y = random.randint(0, max(0, input_image.size[1] - new_watermark_size[1]))
            watermark_position = (random_x, random_y)
    
            # Create a transparent overlay
            overlay = Image.new("RGBA", input_image.size, (0, 0, 0, 0))
            overlay.paste(watermark, watermark_position, mask=watermark)
    
            # Blend the input image and the overlay
            blended_image = Image.alpha_composite(input_image, overlay)
    
            # Save to buffer and upload to S3
            buffer = BytesIO()
            final_image = blended_image.convert("RGB")
            final_image.save(buffer, format="JPEG")
            buffer.seek(0)
            LOGGER.info("Uploading processed image to S3: bucket=%s, key=%s", output_bucket, output_key)
            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
    
            LOGGER.info("Watermark applied successfully and image saved to S3.")
    
        except Exception as e:
            LOGGER.error("Error applying watermark or uploading to S3: %s", e)
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
