import pika
import json
from datetime import datetime
import uuid
from ..config import MICROSERVICES
import logging

# Suppress RabbitMQ logs by setting pika's log level
logging.getLogger("pika").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
def submit_task(tool, input_image, output_image, project_id, task_id):
    """
    Submit a task to RabbitMQ for processing.

    :param tool: The tool configuration dictionary.
    :param input_image: The URI of the input image (bucket/key).
    :param output_image: The URI of the output image (bucket/key).
    :param project_id: The ID of the project.
    :param task_id: The unique identifier for the task.
    """
    try:
        # Fetch RabbitMQ configuration for the tool
        logger.info(f"Fetching RabbitMQ configuration for tool procedure: {tool['procedure']}")
        tool_config = MICROSERVICES.get(tool["procedure"])
        if not tool_config:
            logger.error(f"Tool procedure '{tool['procedure']}' is not supported")
            raise Exception(f"Tool procedure '{tool['procedure']}' is not supported")

        # Prepare the task payload
        payload = {
            "messageId": task_id,  # Unique identifier for the message
            "timestamp": datetime.utcnow().isoformat(),  # ISO 8601 timestamp
            "project_id": str(project_id),
            "tool_id": str(tool["id"]),
            "procedure": tool_config["procedure"],
            "parameters": {
                "inputImageURI": input_image,  # Input image path
                "outputImageURI": output_image,  # Output image path
                **tool["parameters"],  # Include tool-specific parameters
            },
        }
        logger.info(f"Prepared task payload: {json.dumps(payload, indent=2)}")

        # Connect to RabbitMQ and publish the message
        logger.info("Establishing connection to RabbitMQ...")
        connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
        channel = connection.channel()
        logger.info(f"Connection established. Publishing to queue: {tool_config['queue']}")

        channel.basic_publish(
            exchange="",
            routing_key=tool_config["queue"],
            body=json.dumps(payload),
        )
        logger.info(f"Task submitted to queue '{tool_config['queue']}' with task_id: {task_id}")

        # Close the connection
        connection.close()
        logger.info("RabbitMQ connection closed.")
    except Exception as e:
        logger.error(f"Error submitting task: {str(e)}")
        raise