from typing import Any

from pydantic import BaseModel

from .core.messages.result_message import ResultMessage
from .brightness_contrast_request_message import BrightnessContrastRequestMessage


class BrightnessContrastResultOutput(BaseModel):
    type: str
    imageURI: str


class BrightnessContrastResultMessage(ResultMessage[BrightnessContrastResultOutput]):

    def __init__(self, request: BrightnessContrastRequestMessage, tool_result: Any, exception: Exception, *args):
        super().__init__(request, tool_result, exception, *args)
        if exception is None:
            self.output = BrightnessContrastResultOutput(
                type="image",
                imageURI=request.parameters.outputImageURI,
            )
