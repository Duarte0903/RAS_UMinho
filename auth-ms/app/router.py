from flask import request
from flask import Blueprint
from app.controllers.users_controller import UserController
from app.controllers.days_controller import DayController

app_router = Blueprint('app_router', __name__)

# Routes for user management
@app_router.route('/users', methods=['GET', 'POST', 'PUT', 'DELETE'])
def users():
    """
    GET: Retrieve details of the current user.
    POST: Create a new user.
    PUT: Update the details of the current user (except 'type').
    DELETE: Delete the current user's account.
    """
    if request.method == 'GET':
        return UserController.get_user()
    elif request.method == 'POST':
        return UserController.create_user()
    elif request.method == 'PUT':
        return UserController.update_user()
    else:  # Default to DELETE for deleting the user account
        return UserController.delete_user()

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

@app_router.route('/users/authenticate/anonimo', methods=['POST'])
def authenticate_user_anonimo():
    """
    POST: Authenticate an anonimous user and retrieve a JWT token for his session.
    """
    return UserController.authenticate_user_anonimo()

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

