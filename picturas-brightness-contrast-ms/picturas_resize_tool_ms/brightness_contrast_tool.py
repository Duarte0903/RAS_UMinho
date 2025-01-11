from PIL import Image

from .core.tool import Tool
from .brightness_contrast_request_message import ResizeParameters


class BrightnessContrastTool(Tool):

    def __init__(
        self, 
        default_resize_width: int = 300, 
        default_resize_height: int = 200,
    ) -> None:
        """
        Initialize the ResizeTool with default resize width and height.

        Args:
            default_resize_width (int): Default width of the resize in pixels (e.g., 200, 720, 1080).
            default_resize_height (int): Default height of the resize in pixels.
        """
        self.default_resize_width = default_resize_width
        self.default_resize_height = default_resize_height

    def apply(self, parameters: ResizeParameters):
        """
        Apply a resize (size change) to the input image and save the result.

        Args:
            parameters (ResizeParameters): Parameters including input and output image URIs,
                                          resize width, and resize height.
        """
        try:
            # Get resize width and height from parameters, falling back to defaults
            resize_width = parameters.resizeWidth or self.default_resize_width
            resize_height = parameters.resizeHeight or self.default_resize_height
            new_size = (
                int(resize_width),
                int(resize_height)
            )

            # Open the input image
            input_image = Image.open(parameters.inputImageURI)

            # Resize the image            
            final_image = input_image.resize(new_size)

            # Save the output image
            final_image.save(parameters.outputImageURI)
            print(f"Resize applied successfully. Output saved at: {parameters.outputImageURI}")

        except Exception as e:
            print(f"Error applying resize: {e}")
