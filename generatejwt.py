import jwt
from datetime import datetime, timedelta

SECRET_KEY = "picturas"

# Generate a test token
def generate_test_jwt(user_id, type, num_processes):
    payload = {
        "sub": user_id,  # 'sub' for user ID
        "type": type,  # type of the user 
        "num_processes": num_processes,  # number of operations performed by the user today
        "exp": datetime.utcnow() + timedelta(hours=24),  # Expiration time
        "iat": datetime.utcnow(),  # Issued at
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Example usage
test_token = generate_test_jwt("a9e84c1d-1234-4abc-5678-def012345678", "gratuito", 0)
print("Test Token:", test_token)
