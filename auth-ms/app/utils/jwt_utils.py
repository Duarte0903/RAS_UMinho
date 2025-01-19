import jwt
from datetime import datetime, timedelta
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

SECRET_KEY = "picturas"  # Replace with your actual secret key
ALGORITHM = "HS256" 

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
    Decode and validate a JWT token.
    :param token: JWT token string
    :return: Decoded payload as a dictionary
    :raises: Exception if the token is invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise Exception("Token has expired")
    except InvalidTokenError:
        raise Exception("Invalid token")