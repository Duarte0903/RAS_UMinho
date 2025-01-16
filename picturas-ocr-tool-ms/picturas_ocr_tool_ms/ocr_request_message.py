from pydantic import BaseModel
from .core.messages.request_message import RequestMessage

class OCRParameters(BaseModel):
    inputImageURI: str

OCRRequestMessage = RequestMessage[OCRParameters]

