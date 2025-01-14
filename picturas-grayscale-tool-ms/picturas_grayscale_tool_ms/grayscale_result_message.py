from typing import Any

from pydantic import BaseModel

from .core.messages.result_message import ResultMessage
from .grayscale_request_message import GrayScaleRequestMessage


class GrayScaleResultOutput(BaseModel):
    type: str
    imageURI: str


class GrayScaleResultMessage(ResultMessage[GrayScaleResultOutput]):

    def __init__(self, request: GrayScaleRequestMessage, tool_result: Any, exception: Exception, *args):
        super().__init__(request, tool_result, exception, *args)
        if exception is None:
            self.output = GrayScaleResultOutput(
                type="image",
                imageURI=request.parameters.outputImageURI,
            )