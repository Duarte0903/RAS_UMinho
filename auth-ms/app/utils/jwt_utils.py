import jwt
from datetime import datetime, timedelta

SECRET_KEY = "picturas"  # Replace with your actual secret key

def generate_jwt(user_id, user_type, num_processes):
    """
    Generate a JWT token for a user based on their type.
    :param user_id: ID of the user
    :param user_type: Type of the user (e.g., 'anônimo', 'gratuito', 'premium')
    :return: Encoded JWT token
    """
    payload = {
        "sub": user_id,  # Subject (user ID)
        "type": user_type,  # User type
        "num_processes": num_processes,  # User type
        "iat": datetime.utcnow(),  # Issued at
        "exp": datetime.utcnow() + timedelta(hours=1)  # Expires in 1 hour
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_jwt(token):
    """
    Decodes and verifies the JWT.

    :param token: JWT token from the Authorization header.
    :return: Decoded payload if the token is valid.
    :raises: Exception if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")