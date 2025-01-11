import json
import logging
import os
import uuid
from datetime import datetime
import pika
import boto3

# Environment variables
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
LOG_FORMAT = '%(asctime)s [%(levelname)s] %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)

LOGGER = logging.getLogger(__name__)

# MinIO connection settings
MINIO_ACCESS_KEY = "admin"  # Replace with your MinIO access key
MINIO_SECRET_KEY = "admin123"  # Replace with your MinIO secret key
MINIO_ENDPOINT = "http://minio:9000"

# Initialize MinIO client
s3_client = boto3.client(
    "s3",
    endpoint_url=MINIO_ENDPOINT,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
)


def message_queue_connect():
    """
    Connect to RabbitMQ and return the connection and channel.
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
    channel = connection.channel()
    return connection, channel


def publish_request(channel, parameters, procedure, routing_key):
    """
    Publish a request message to the specified queue.
    """
    request_id = str(uuid.uuid4())
    message = {
        "messageId": request_id,
        "timestamp": datetime.now().isoformat(),
        "procedure": procedure,
        "parameters": parameters,
    }

    channel.basic_publish(
        exchange="picturas.tools",
        routing_key=routing_key,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2,  # Make message persistent
            correlation_id=request_id,  # Correlate the response
            reply_to="results",  # Reply queue
        ),
    )
    LOGGER.info("Published request '%s' to '%s'", request_id, routing_key)
    return request_id


def wait_for_response(channel, request_id):
    """
    Wait for a response message with the matching `request_id`.
    Handles cases where the response `messageId` includes a prefix like `completion-`.
    """
    LOGGER.info("Waiting for response for request ID '%s'...", request_id)

    for method_frame, properties, body in channel.consume(queue="results", auto_ack=True):
        response = json.loads(body)
        LOGGER.debug("Received message from queue: %s", response)

        # Normalize the `messageId` by removing the `completion-` prefix if it exists
        response_id = response.get("messageId", "")
        if response_id.startswith("completion-"):
            response_id = response_id[len("completion-"):]

        if response_id == request_id:
            LOGGER.info("Received matching response: %s", response)
            # Stop consuming after the response is found
            channel.basic_cancel(method_frame.consumer_tag)
            return response

        LOGGER.warning("Received message for another request ID: %s", response.get("messageId"))


if __name__ == "__main__":
    # Connect to RabbitMQ
    connection, channel = message_queue_connect()

    try:
        # Generate URLs for Bezel processing
        bezel_input_image_url = s3_client.generate_presigned_url(
            "get_object", Params={"Bucket": "src", "Key": "daad.jpg"}, ExpiresIn=3600
        )
        bezel_output_image_url = s3_client.generate_presigned_url(
            "put_object", Params={"Bucket": "out", "Key": "example_with_bezel.jpg"}, ExpiresIn=3600
        )

        # Step 1: Publish a request to the Bezel microservice
        bezel_parameters = {
            "inputImageURI": "s3://src/daad.jpg",
            "outputImageURI": "s3://out/example_with_bezel.jpg",
            "bezelColor": "blue",
            "bezelThickness": 10,
        }
        bezel_request_id = publish_request(channel, bezel_parameters, "add_bezel", "requests.bezel")

        # Step 2: Wait for Bezel response
        bezel_response = wait_for_response(channel, bezel_request_id)
        LOGGER.info("Bezel processing completed: %s", bezel_response)

        # Generate URLs for Watermark processing
        watermark_output_image_url = s3_client.generate_presigned_url(
            "put_object", Params={"Bucket": "out", "Key": "example_with_watermark.jpg"}, ExpiresIn=3600
        )

        # Step 3: Publish a request to the Watermark microservice
        watermark_parameters = {
            "inputImageURI": "s3://out/example_with_bezel.jpg",
            "outputImageURI": "s3://out/example_with_watermark.jpeg",
        }
        watermark_request_id = publish_request(channel, watermark_parameters, "add_watermark", "requests.watermark")

        # Step 4: Wait for Watermark response
        watermark_response = wait_for_response(channel, watermark_request_id)
        LOGGER.info("Watermark processing completed: %s", watermark_response)

    finally:
        connection.close()
