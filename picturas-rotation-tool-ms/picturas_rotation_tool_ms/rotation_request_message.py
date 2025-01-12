from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class RotationParameters(BaseModel):
    inputImageURI: str
    outputImageURI: str
    angle: float = 90
    expand: bool = True

RotationRequestMessage = RequestMessage[RotationParameters]