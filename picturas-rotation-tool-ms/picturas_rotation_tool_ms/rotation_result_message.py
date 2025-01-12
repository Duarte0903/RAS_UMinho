from typing import Any

from pydantic import BaseModel

from .core.messages.result_message import ResultMessage
from .rotation_request_message import RotationRequestMessage


class RotationResultOutput(BaseModel):
    type: str
    imageURI: str


class RotationResultMessage(ResultMessage[RotationResultOutput]):

    def __init__(self, request: RotationRequestMessage, tool_result: Any, exception: Exception, *args):
        super().__init__(request, tool_result, exception, *args)
        if exception is None:
            self.output = RotationResultOutput(
                type="image",
                imageURI=request.parameters.outputImageURI,
            )
