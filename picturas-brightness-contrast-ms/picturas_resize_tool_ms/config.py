import os

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = os.getenv("RABBITMQ_PORT", 5672)
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "guest")

RABBITMQ_REQUESTS_QUEUE_NAME = os.getenv("RABBITMQ_REQUESTS_QUEUE_NAME", "brightness-contrast-requests")

RABBITMQ_RESULTS_EXCHANGE = os.getenv("RABBITMQ_RESULTS_EXCHANGE", "picturas.tools")
RABBITMQ_RESULTS_ROUTING_KEY = os.getenv("RABBITMQ_RESULTS_ROUTING_KEY", "results")

PICTURAS_LOG_LEVEL = os.getenv("PICTURAS_LOG_LEVEL", "INFO")
PICTURAS_MS_NAME = os.getenv("PICTURAS_MS_NAME", "picturas-brightness-contrast-ms")
PICTURAS_NUM_THREADS = os.getenv("PICTURAS_NUM_THREADS", 4)
