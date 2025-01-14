import os

SQLALCHEMY_DATABASE_URI = "postgresql://picturas:picturas@postgres:5432/projects"
SQLALCHEMY_TRACK_MODIFICATIONS = False

MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "admin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "admin123")

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
    },
}
