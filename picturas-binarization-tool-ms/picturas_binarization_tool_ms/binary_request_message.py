from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class BinaryParameters(BaseModel):
    inputImageURI: str
    outputImageURI: str


BinaryRequestMessage = RequestMessage[BinaryParameters]