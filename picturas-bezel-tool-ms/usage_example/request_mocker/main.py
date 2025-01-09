import json
import logging
import os
import random
import time
import uuid
from datetime import datetime

import pika
from pika.exchange_type import ExchangeType

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
PICTURAS_SRC_FOLDER = os.getenv("PICTURAS_SRC_FOLDER", "./usage_example/images/src/")
PICTURAS_OUT_FOLDER = os.getenv("PICTURAS_OUT_FOLDER", "./usage_example/images/out/")

LOG_FORMAT = '%(asctime)s [%(levelname)s] %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)

LOGGER = logging.getLogger(__name__)


def message_queue_connect():
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
    channel = connection.channel()
    return connection, channel


def message_queue_setup(channel):
    channel.exchange_declare(
        exchange="picturas.tools",
        exchange_type=ExchangeType.direct,
        durable=True,
    )
    channel.queue_declare(queue="results")
    channel.queue_bind(
        queue="results",
        exchange="picturas.tools",
        routing_key="results",
    )

    channel.queue_declare(queue="bezel-requests")
    channel.queue_bind(
        queue="bezel-requests",
        exchange="picturas.tools",
        routing_key="requests.bezel",
    )


def publish_request_message(channel, routing_key, request_id, procedure, parameters):
    # Build the request message payload
    message = {
        "messageId": request_id,
        "timestamp": datetime.now().isoformat(),
        "procedure": procedure,
        "parameters": parameters,
    }

    # Publish the message to the exchange
    channel.basic_publish(
        exchange="picturas.tools",
        routing_key=routing_key,
        body=json.dumps(message),
    )

    logging.info("Published request '%s' to '%s'", request_id, routing_key)


def publish_mock_requests_forever():
    try:
        while True:
            for file_name in os.listdir(PICTURAS_SRC_FOLDER):
                request_id = str(uuid.uuid4())

                # Bezel-specific parameters
                bezel_parameters = {
                    "inputImageURI": os.path.join(PICTURAS_SRC_FOLDER, file_name),
                    "outputImageURI": os.path.join(PICTURAS_OUT_FOLDER, file_name),
                    "bezelColor": "red",  # Example color, can be randomized or passed as a parameter
                    "bezelThickness": 20,  # Example thickness, can also be randomized
                }

                publish_request_message(channel, "requests.bezel", request_id, "add_bezel", bezel_parameters)
                time.sleep(random.uniform(2, 5))
    finally:
        connection.close()


if __name__ == "__main__":
    connection, channel = message_queue_connect()
    message_queue_setup(channel)  # Ensure queues and bindings are set up
    publish_mock_requests_forever()
    # TODO receive and process result messages on a separate thread/runtime
