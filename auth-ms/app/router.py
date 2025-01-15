from flask import request
from flask import Blueprint
from app.controllers.users_controller import UserController
from app.controllers.days_controller import DayController

app_router = Blueprint('app_router', __name__)

# Routes for user management
@app_router.route('/users', methods=['GET', 'POST'])
def users():
    """
    GET: Retrieve details of the current user.
    POST: Create a new user.
    """
    if request.method == 'POST':
        return UserController.create_user()
    else:  # Default to GET for fetching user details
        return UserController.get_user()

@app_router.route('/users/name', methods=['PUT'])
def update_user_name():
    """
    PUT: Update the name of the current user.
    """
    return UserController.update_user_name()

@app_router.route('/users/email', methods=['PUT'])
def update_user_email():
    """
    PUT: Update the email address of the current user.
    """
    return UserController.update_user_email()

@app_router.route('/users/password', methods=['PUT'])
def update_user_password():
    """
    PUT: Update the password of the current user.
    """
    return UserController.update_user_password()

@app_router.route('/users/type', methods=['PUT'])
def update_user_type():
    """
    PUT: Update the type (e.g., anônimo, gratuito, premium) of the current user.
    """
    return UserController.update_user_type()

@app_router.route('/users/authenticate', methods=['POST'])
def authenticate_user():
    """
    POST: Authenticate a user and retrieve a JWT token.
    """
    return UserController.authenticate_user()

@app_router.route('/users', methods=['DELETE'])
def delete_user():
    """
    DELETE: Delete the current user's account.
    """
    return UserController.delete_user()

# Routes for daily operations
@app_router.route('/days', methods=['GET', 'POST'])
def days():
    """
    GET: Retrieve the current user's operations record for today.
    POST: Increment the current user's operations count for today.
    """
    if request.method == 'POST':
        return DayController.increment_operations()
    else:  # Default to GET for fetching daily operations record
        return DayController.get_day_record()

