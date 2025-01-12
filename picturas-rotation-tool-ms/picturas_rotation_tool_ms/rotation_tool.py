from PIL import Image

from .core.tool import Tool
from .rotation_request_message import RotationParameters


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

    def apply(self, parameters: RotationParameters):
        """
        Rotate the input image by the specified angle and save the result.

        Args:
            parameters (RotationParameters): Parameters including input and output image URIs,
                                              rotation angle, and expand option.
        """
        try:
            # Get rotation angle and expand option from parameters, falling back to defaults
            angle = parameters.angle or self.default_rotation_angle
            expand = parameters.expand if parameters.expand is not None else self.default_rotation_expand

            # Open the input image
            input_image = Image.open(parameters.inputImageURI)

            # Rotate the image
            rotated_image = input_image.rotate(angle, expand=expand)

            # Save the output image
            rotated_image.save(parameters.outputImageURI)
            print(f"Image rotated successfully. Output saved at: {parameters.outputImageURI}")

        except Exception as e:
            print(f"Error rotating image: {e}")
