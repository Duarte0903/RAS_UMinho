from PIL import Image, ImageEnhance

from .core.tool import Tool
from .brightness_contrast_request_message import BrightnessContrastParameters


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
            input_image = Image.open(parameters.inputImageURI)

            # Aplica brilho
            enhancer = ImageEnhance.Brightness(input_image)
            final_image = enhancer.enhance(brightness)
            
            # Aplica contraste
            enhancer = ImageEnhance.Contrast(final_image)
            final_image = enhancer.enhance(contrast)

            # Save the output image
            final_image.save(parameters.outputImageURI)
            print(f"Brightness and contrast applied successfully. Output saved at: {parameters.outputImageURI}")

        except Exception as e:
            print(f"Error applying filter: {e}")
