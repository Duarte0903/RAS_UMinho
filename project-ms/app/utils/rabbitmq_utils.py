import pika
import json
from datetime import datetime
import uuid
from ..config import MICROSERVICES

def submit_task(tool, input_image, output_image, project_id,task_id):
    """
    Submit a task to RabbitMQ for processing.

    :param tool: The tool configuration dictionary.
    :param input_image: The URI of the input image (bucket/key).
    :param output_image: The URI of the output image (bucket/key).
    :param project_id: The ID of the project.
    """
    # Fetch RabbitMQ configuration for the tool
    tool_config = MICROSERVICES.get(tool["procedure"])
    if not tool_config:
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

    # Publish the task to RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
    channel = connection.channel()

    channel.basic_publish(
        exchange="",
        routing_key=tool_config["queue"],
        body=json.dumps(payload),
    )
    connection.close()

    print(f"Task submitted to queue: {tool_config['queue']}")
