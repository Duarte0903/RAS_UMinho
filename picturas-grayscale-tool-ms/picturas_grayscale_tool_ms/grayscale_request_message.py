from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class GrayScaleParameters(BaseModel):
    inputImageURI: str
    outputImageURI: str


GrayScaleRequestMessage = RequestMessage[GrayScaleParameters]