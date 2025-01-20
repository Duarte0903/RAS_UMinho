from io import BytesIO
from PIL import Image
import pytesseract
import logging
import boto3
from .core.tool import Tool
from .config import MINIO_ACCESS_KEY, MINIO_SECRET_KEY
from .ocr_request_message import OCRParameters

LOGGER = logging.getLogger(__name__)

class OCRTool(Tool):
    
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
        
    def apply(self, parameters: OCRParameters):
        """
        Perform OCR on the input image and return the extracted text.

        Args:
            parameters (OCRParameters): OCR parameters.

        Returns:
            str: Extracted text from the image.
        """
        # Parse input bucket/key from URI
        input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
        
        # Download the input image from MinIO
        LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
        input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
        input_image = Image.open(BytesIO(input_obj['Body'].read()))

        # Extract text from the image
        extracted_text = pytesseract.image_to_string(input_image)
            
        # Adicionando print para exibir o texto no terminal
        LOGGER.info("Text extracted successfully and sent to client. Text: %s", extracted_text)
        return extracted_text

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
