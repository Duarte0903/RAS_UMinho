from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class BinaryParameters(BaseModel):
    inputImageURI: str
    outputImageURI: str
    threshold: int = 128


BinaryRequestMessage = RequestMessage[BinaryParameters]