from PIL import Image

from .core.tool import Tool
from .binary_request_message import BinaryParameters


class BinaryTool(Tool):

    def __init__(
            self,
            threshold: float = 128,
    ) -> None: 
        """
        Initialize the BinaryTool with the path to the binary image.

        Args:
            threshold (float): Threshold level of binarization (From what RGB of the original it should apply) (0 to 255).
        """
        self.threshold = threshold

    
    def apply(self, parameters: BinaryParameters):
        """
        Apply the binarization to the input image and save the result.

        Args:
            parameters (BinaryParameters): binary parameters.
        """
        # Open the input image
        input_image = Image.open(parameters.inputImageURI).convert("RGBA")

        # Convert image to grayscale
        grayscale_image = input_image.convert("L")  # L mode is grayscale

        # Apply the threshold
        binarized_image = grayscale_image.point(lambda p: 255 if p >= self.threshold else 0, mode="1")

        final_image = binarized_image.convert("RGB")
        final_image.save(parameters.outputImageURI)