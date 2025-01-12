from typing import Any

from pydantic import BaseModel

from .core.messages.result_message import ResultMessage
from .binary_request_message import BinaryRequestMessage


class BinaryResultOutput(BaseModel):
    type: str
    imageURI: str


class BinaryResultMessage(ResultMessage[BinaryResultOutput]):

    def __init__(self, request: BinaryRequestMessage, tool_result: Any, exception: Exception, *args):
        super().__init__(request, tool_result, exception, *args)
        if exception is None:
            self.output = BinaryResultOutput(
                type="image",
                imageURI=request.parameters.outputImageURI,
            )