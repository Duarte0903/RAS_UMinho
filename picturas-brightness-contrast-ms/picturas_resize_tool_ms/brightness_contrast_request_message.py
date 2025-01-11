from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class BrightnessContrastParameters(BaseModel):
    inputImageURI: str  # Path to the input image
    outputImageURI: str  # Path to save the output image
    brightness: float = 300 # Multiplier for the brightness (e.g., 1.2, 0.5, 0.8)
    contrast: float = 200 # Multiplier for the contrast


BrightnessContrastRequestMessage = RequestMessage[BrightnessContrastParameters]
