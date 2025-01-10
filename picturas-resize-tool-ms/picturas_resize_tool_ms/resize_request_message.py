from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class ResizeParameters(BaseModel):
    inputImageURI: str  # Path to the input image
    outputImageURI: str  # Path to save the output image
    resizeWidth: int = 300 # Width of the resize in pixels (e.g., 200, 720, 1080)
    resizeHeight: int = 200 # Height of the resize in pixels


ResizeRequestMessage = RequestMessage[ResizeParameters]
