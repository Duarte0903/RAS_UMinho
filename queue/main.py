import json
import logging
import os
import uuid
from datetime import datetime
import pika
from pika.exchange_type import ExchangeType

# Environment variables
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
LOG_FORMAT = '%(asctime)s [%(levelname)s] %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)

LOGGER = logging.getLogger(__name__)

# Configuration for microservices
MICROSERVICES = {
    "watermark": {
        "queue": "watermark-requests",
        "routing_key": "requests.watermark",
        "procedure": "add_watermark",
    },
    "bezel": {
        "queue": "bezel-requests",
        "routing_key": "requests.bezel",
        "procedure": "add_bezel",
    },
    "binary": {
        "queue": "binary-requests",
        "routing_key": "requests.binary",
        "procedure": "apply_binarization",
    },
    "brightness": {
        "queue": "brightness-requests",
        "routing_key": "requests.brightness",
        "procedure": "apply_brightness",
    },
    "resize": {
        "queue": "resize-requests",
        "routing_key": "requests.resize",
        "procedure": "resize",
    },
    # Add new microservices here
    "removebg": {
        "queue": "removebg-requests",
        "routing_key": "requests.removebg",
        "procedure": "removebg",
    },
    "rotation":{
        "queue": "rotation-requests",
        "routing_key": "requests.rotation",
        "procedure": "rotation",
    },
        "grayscale": {
        "queue": "grayscale-requests",
        "routing_key": "requests.grayscale",
        "procedure": "grayscale",
    }
}


def message_queue_connect():
    """
    Connect to RabbitMQ and return the connection and channel.
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
    channel = connection.channel()
    return connection, channel


def message_queue_setup(channel):
    """
    Set up the RabbitMQ exchange and queues for all microservices.
    """
    # Declare the exchange
    channel.exchange_declare(
        exchange="picturas.tools",
        exchange_type=ExchangeType.direct,
        durable=True,
    )

    # Declare the results queue
    channel.queue_declare(queue="results")
    channel.queue_bind(queue="results", exchange="picturas.tools", routing_key="results")

    # Declare and bind queues for each microservice
    for service_name, config in MICROSERVICES.items():
        channel.queue_declare(queue=config["queue"])
        channel.queue_bind(queue=config["queue"], exchange="picturas.tools", routing_key=config["routing_key"])

    LOGGER.info("RabbitMQ setup completed for all microservices.")


def publish_request_message(channel, service_name, parameters):
    """
    Publish a request message to the queue for a specific microservice.
    """
    if service_name not in MICROSERVICES:
        raise ValueError(f"Unknown service: {service_name}")

    config = MICROSERVICES[service_name]
    request_id = str(uuid.uuid4())
    message = {
        "messageId": request_id,
        "timestamp": datetime.now().isoformat(),
        "procedure": config["procedure"],
        "parameters": parameters,
    }

    channel.basic_publish(
        exchange="picturas.tools",
        routing_key=config["routing_key"],
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2),  # Make message persistent
    )
    LOGGER.info("Published request '%s' to '%s' for service '%s'", request_id, config["queue"], service_name)
    return request_id


def process_result_message(ch, method, properties, body):
    """
    Callback function to process result messages from the `results` queue.
    """
    try:
        result_message = json.loads(body)
        LOGGER.info("Received result message: %s", result_message)

        # Example: Process the result
        output_uri = result_message.get("outputImageURI", "Unknown")
        LOGGER.info("Processed image available at: %s", output_uri)

        # Acknowledge the message
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        LOGGER.error("Failed to process message: %s", e)
        ch.basic_nack(delivery_tag=method.delivery_tag)


def consume_results(channel):
    """
    Start consuming messages from the `results` queue.
    """
    channel.basic_consume(
        queue="results",
        on_message_callback=process_result_message,
        auto_ack=False,
    )
    LOGGER.info("Waiting for result messages...")
    channel.start_consuming()


if __name__ == "__main__":
    # Connect to RabbitMQ
    connection, channel = message_queue_connect()
    message_queue_setup(channel)
