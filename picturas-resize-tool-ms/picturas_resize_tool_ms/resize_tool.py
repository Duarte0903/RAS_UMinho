from io import BytesIO
from PIL import Image
import logging, boto3

from .core.tool import Tool
from .resize_request_message import ResizeParameters
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY

LOGGER = logging.getLogger(__name__)


class ResizeTool(Tool):

    def __init__(
        self, 
        default_width: int = 300, 
        default_height: int = 200,
    ) -> None:
        """
        Initialize the ResizeTool with default resize width and height.

        Args:
            default_width (int): Default width of the resize in pixels (e.g., 200, 720, 1080).
            default_height (int): Default height of the resize in pixels.
        """
        self.default_width = default_width
        self.default_height = default_height

        # MinIO client setup
        self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY, #vem do ficheiro config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )
        
    def apply(self, parameters: ResizeParameters):
        """
        Apply a resize (size change) to the input image and save the result.

        Args:
            parameters (ResizeParameters): Parameters including input and output image URIs,
                                          resize width, and resize height.
        """
        try:
            # Get resize width and height from parameters, falling back to defaults
            width = parameters.width or self.default_width
            height = parameters.height or self.default_height

            # Parse input and output bucket/key from URIs
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)
            
            # Download the input image from MinIO
            LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read()))
            
            # Resize the image            
            LOGGER.info("Resizing the image.")
            final_image = input_image.resize((width, height))

            # Save the processed image to MinIO
            LOGGER.info("Uploading processed image to MinIO: %s/%s", output_bucket, output_key)
            buffer = BytesIO()
            final_image.save(buffer, format="JPEG")  # Adjust format if needed
            buffer.seek(0)

            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
            LOGGER.info("Resizing applied successfully and image saved to MinIO.")

        except Exception as e:
            print(f"Error applying resize: {e}")

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
