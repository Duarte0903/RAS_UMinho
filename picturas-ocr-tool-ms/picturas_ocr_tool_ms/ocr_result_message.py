from typing import Any
from pydantic import BaseModel
from .core.messages.result_message import ResultMessage
from .ocr_request_message import OCRRequestMessage

class OCRResultOutput(BaseModel):
    type: str
    text: str

class OCRResultMessage(ResultMessage[OCRResultOutput]):
    def __init__(self, request: OCRRequestMessage, tool_result: Any, exception: Exception, *args):
        super().__init__(request, tool_result, exception, *args)
        if exception is None:
            self.output = OCRResultOutput(
                type="text",
                text=tool_result
            )

