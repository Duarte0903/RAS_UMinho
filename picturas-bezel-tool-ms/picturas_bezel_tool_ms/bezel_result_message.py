from typing import Any

from pydantic import BaseModel

from .core.messages.result_message import ResultMessage
from .bezel_request_message import BezelRequestMessage


class BezelResultOutput(BaseModel):
    type: str
    imageURI: str


class BezelResultMessage(ResultMessage[BezelResultOutput]):

    def __init__(self, request: BezelRequestMessage, tool_result: Any, exception: Exception, *args):
        super().__init__(request, tool_result, exception, *args)
        if exception is None:
            self.output = BezelResultOutput(
                type="image",
                imageURI=request.parameters.outputImageURI,
            )
