from typing import Any

from pydantic import BaseModel

from .core.messages.result_message import ResultMessage
from .removebg_request_message import RemovebgRequestMessage


class RemovebgResultOutput(BaseModel):
    type: str
    imageURI: str


class RemovebgResultMessage(ResultMessage[RemovebgResultOutput]):

    def __init__(self, request: RemovebgRequestMessage, tool_result: Any, exception: Exception, *args):
        super().__init__(request, tool_result, exception, *args)
        if exception is None:
            self.output = RemovebgResultOutput(
                type="image",
                imageURI=request.parameters.outputImageURI,
            )