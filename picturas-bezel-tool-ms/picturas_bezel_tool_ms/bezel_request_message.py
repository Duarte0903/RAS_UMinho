from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class BezelParameters(BaseModel):
    inputImageURI: str  # Path to the input image
    outputImageURI: str  # Path to save the output image
    bezelColor: str  # Color of the bezel (e.g., "red", "#000000", (255, 255, 255))
    bezelThickness: int  # Thickness of the bezel in pixels


BezelRequestMessage = RequestMessage[BezelParameters]
