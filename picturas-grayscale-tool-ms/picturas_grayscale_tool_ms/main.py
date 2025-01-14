import logging

from .config import PICTURAS_LOG_LEVEL
from .core.message_processor import MessageProcessor
from .core.message_queue_setup import message_queue_connect
from .grayscale_request_message import GrayScaleRequestMessage
from .grayscale_result_message import GrayScaleResultMessage
from .grayscale_tool import GrayScaleTool

# Logging setup
LOG_FORMAT = '%(asctime)s [%(levelname)s] %(message)s'
logging.basicConfig(level=PICTURAS_LOG_LEVEL, format=LOG_FORMAT)

LOGGER = logging.getLogger(__name__)

if __name__ == "__main__":
    # Connect to the message queue
    connection, channel = message_queue_connect()

    # Initialize the tool, message classes, and processor
    tool = GrayScaleTool()  # Update with any necessary arguments if required
    request_msg_class = GrayScaleRequestMessage
    result_msg_class = GrayScaleResultMessage

    message_processor = MessageProcessor(tool, request_msg_class, result_msg_class, channel)

    try:
        # Start processing messages
        message_processor.start()
    except KeyboardInterrupt:
        # Gracefully stop on interrupt
        message_processor.stop()

    # Close the connection
    connection.close()
