from PIL import Image

from .core.tool import Tool
from .resize_request_message import ResizeParameters


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

            # Open the input image
            input_image = Image.open(parameters.inputImageURI)

            # Resize the image            
            final_image = input_image.resize((width, height))

            # Save the output image
            final_image.save(parameters.outputImageURI)
            print(f"Resize applied successfully. Output saved at: {parameters.outputImageURI}")

        except Exception as e:
            print(f"Error applying resize: {e}")
