from PIL import Image
import pytesseract
from .core.tool import Tool
from .ocr_request_message import OCRParameters

class OCRTool(Tool):
    def apply(self, parameters: OCRParameters):
        """
        Perform OCR on the input image and return the extracted text.

        Args:
            parameters (OCRParameters): OCR parameters.

        Returns:
            str: Extracted text from the image.
        """
        try:
            input_image = Image.open(parameters.inputImageURI)
            extracted_text = pytesseract.image_to_string(input_image)
            
            # Adicionando print para exibir o texto no terminal
            print(f"Texto extraído: {extracted_text}")
            
            return extracted_text
        except Exception as e:
            raise RuntimeError(f"OCR processing failed: {e}")

