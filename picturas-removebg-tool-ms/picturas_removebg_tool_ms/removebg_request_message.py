from pydantic import BaseModel

from .core.messages.request_message import RequestMessage


class RemovebgParameters(BaseModel):
    inputImageURI: str
    outputImageURI: str


RemovebgRequestMessage = RequestMessage[RemovebgParameters]