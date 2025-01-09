from PIL import Image, ImageOps

from .core.tool import Tool
from .bezel_request_message import BezelParameters


class BezelTool(Tool):

    def __init__(self, default_bezel_color: str = "black", default_bezel_thickness: int = 10) -> None:
        """
        Initialize the BezelTool with default bezel color and thickness.

        Args:
            default_bezel_color (str): Default color of the bezel (e.g., "red", "#000000", (255, 255, 255)).
            default_bezel_thickness (int): Default thickness of the bezel in pixels.
        """
        self.default_bezel_color = default_bezel_color
        self.default_bezel_thickness = default_bezel_thickness

    def apply(self, parameters: BezelParameters):
        """
        Apply a bezel (border) to the input image and save the result.

        Args:
            parameters (BezelParameters): Parameters including input and output image URIs,
                                          bezel color, and bezel thickness.
        """
        try:
            # Get bezel color and thickness from parameters, falling back to defaults
            bezel_color = parameters.bezelColor or self.default_bezel_color
            bezel_thickness = parameters.bezelThickness or self.default_bezel_thickness

            # Open the input image
            input_image = Image.open(parameters.inputImageURI)

            # Add bezel using ImageOps.expand
            image_with_bezel = ImageOps.expand(
                input_image, border=bezel_thickness, fill=bezel_color
            )

            # Save the output image
            image_with_bezel.save(parameters.outputImageURI)
            print(f"Bezel added successfully. Output saved at: {parameters.outputImageURI}")

        except Exception as e:
            print(f"Error adding bezel: {e}")
