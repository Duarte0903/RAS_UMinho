from flask import request
from flask import Blueprint
from app.controllers.project_controller import ProjectController
from app.controllers.image_controller import ImageController
from app.controllers.tool_controller import ToolController
app_router = Blueprint('app_router', __name__)

# Routes for project management
@app_router.route('/projects', methods=['GET', 'POST'])
def projects():
    """
    GET: Retrieve all projects for the current user.
    POST: Create a new project for the current user.
    """
    if request.method == 'POST':
        return ProjectController.add_project()
    else:  # Default to GET for fetching projects
        return ProjectController.get_projects_by_user()

@app_router.route('/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    """
    PUT: Update the name of a specific project (owned by the user).
    """
    return ProjectController.update_project(project_id)

@app_router.route('/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    """
    DELETE: Delete a specific project (owned by the user).
    """
    return ProjectController.delete_project(project_id)

# Routes for image management
@app_router.route('/projects/<project_id>/images', methods=['POST'])
def upload_image(project_id):
    """
    POST: Upload an image to a specific project's source bucket.
    """
    return ImageController.upload_image(project_id)

@app_router.route('/projects/<project_id>/images', methods=['GET'])
def get_images(project_id):
    """
    GET: Retrieve all processed image links from a project's output bucket.
    """
    return ImageController.get_images(project_id)

@app_router.route('/projects/<project_id>/images/<image_id>', methods=['DELETE'])
def delete_image(project_id, image_id):
    """
    DELETE: Delete a specific image from a project's source bucket.
    """
    return ImageController.delete_image(project_id, image_id)

# Routes for tool management
@app_router.route('/projects/<project_id>/tools', methods=['GET'])
def get_tools(project_id):
    """
    GET: Retrieve all tools associated with a specific project.
    """
    return ToolController.get_tools(project_id)

@app_router.route('/projects/<project_id>/tools', methods=['POST'])
def add_tool(project_id):
    """
    POST: Add a new tool to a specific project.
    """
    return ToolController.add_tool(project_id)

@app_router.route('/projects/<project_id>/tools/<tool_id>', methods=['PUT'])
def update_tool(project_id, tool_id):
    """
    PUT: Update a specific tool's configuration for a project.
    """
    return ToolController.update_tool(project_id, tool_id)

@app_router.route('/projects/<project_id>/tools/<tool_id>', methods=['DELETE'])
def delete_tool(project_id, tool_id):
    """
    DELETE: Remove a specific tool from a project.
    """
    return ToolController.delete_tool(project_id, tool_id)

# Routes for project processing and status
@app_router.route('/projects/<project_id>/process', methods=['POST'])
def process_project(project_id):
    """
    POST: Start the processing workflow for a specific project.
    """
    return ProjectController.process_project(project_id)

@app_router.route('/projects/<project_id>/status', methods=['GET'])
def get_project_status(project_id):
    """
    GET: Retrieve the processing status of a specific project.
    """
    return ProjectController.get_project_status(project_id)
