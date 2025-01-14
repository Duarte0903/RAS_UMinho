import jwt

SECRET_KEY = "picturas"

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
