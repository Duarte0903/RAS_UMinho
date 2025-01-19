from flask import request, Blueprint
from app.controllers.project_controller import ProjectController
from app.controllers.image_controller import ImageController
from app.controllers.tool_controller import ToolController
app_router = Blueprint('app_router', __name__)

# Routes for projects management
@app_router.route('/projects', methods=['GET', 'POST', 'DELETE'])
def projects():
    """
    GET: Retrieve all projects for the current user.
    POST: Create a new project for the current user.
    DELETE: Delete all projects of the current user.
    """
    if request.method == 'DELETE':
        return ProjectController.delete_projects_user()
    elif request.method == 'POST':
        return ProjectController.add_project()
    else:  # Default to GET for fetching projects
        return ProjectController.get_projects_by_user()

# Routes for a specific project management
@app_router.route('/projects/<project_id>', methods=['GET', 'PUT', 'DELETE'])
def project(project_id):
    """
    GET: Retrieve details of a specific project by its ID.
    PUT: Update the name of a specific project (owned by the user).
    DELETE: Delete a specific project (owned by the user).
    """
    if request.method == 'DELETE':
        return ProjectController.delete_project(project_id)
    elif request.method == 'PUT':
        return ProjectController.update_project(project_id)
    else:  # Default to GET for fetching project details
        return ProjectController.get_project_by_id(project_id)
    
# Routes for image management
@app_router.route('/projects/<project_id>/images', methods=['GET', 'POST'])
def images(project_id):
    """
    GET: Retrieve all processed image links from a project's output bucket.
    POST: Upload an image to a specific project's source bucket.
    """
    if request.method == 'POST':
        return ImageController.upload_image(project_id)
    else:  # Default to GET for fetching images
        return ImageController.get_images(project_id)

@app_router.route('/projects/<project_id>/images/<image_id>', methods=['DELETE'])
def delete_image(project_id, image_id):
    """
    DELETE: Delete a specific image from a project's source bucket.
    """
    return ImageController.delete_image(project_id, image_id)

# Routes for tool management
@app_router.route('/projects/<project_id>/tools', methods=['GET', 'POST'])
def tools(project_id):
    """
    GET: Retrieve all tools associated with a specific project.
    POST: Add a new tool to a specific project.
    """
    if request.method == 'POST':
        return ToolController.add_tool(project_id)
    else:  # Default to GET for fetching tools
        return ToolController.get_tools(project_id)

@app_router.route('/projects/<project_id>/tools/<tool_id>', methods=['PUT', 'DELETE'])
def tool(project_id, tool_id):
    """
    PUT: Update a specific tool's configuration for a project.
    DELETE: Remove a specific tool from a project.
    """
    if request.method == 'PUT':
        return ToolController.update_tool(project_id, tool_id)
    else: # Default to DELETE for deleting a tool
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

# Route to serve images from MinIO through the backend
@app_router.route('/images/<bucket>/<path:filename>', methods=['GET'])
def serve_image(bucket, filename):
    """
    GET: Serve an image from the specified bucket through the backend.
    """
    return ImageController.serve_image(bucket, filename)
