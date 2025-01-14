# API Documentation

This document outlines the endpoints available in the application, including the required headers and example request bodies for each route.

## General Requirements

### Headers
All requests must include the following header:
```
Authorization: Bearer <JWT_TOKEN>
```

Replace `<JWT_TOKEN>` with a valid JSON Web Token.

---

## Endpoints

### Project Management

#### Retrieve All Projects
**GET** `/projects`
- **Description**: Retrieve all projects for the current user. (user id is exctracted from jwt)
- **Headers**: As specified in the General Requirements.
- **Body**: None.

#### Create a New Project
**POST** `/projects`
- **Description**: Create a new project for the current user.
- **Headers**: As specified in the General Requirements.
- **Body**:
  ```json
  {
      "name": "<project_name>",
  }
  ```

#### Update a Project
**PUT** `/projects/<project_id>`
- **Description**: Update the name of a specific project (owned by the user).
- **Headers**: As specified in the General Requirements.
- **Body**:
  ```json
  {
      "name": "<new_project_name>"
  }
  ```

#### Delete a Project
**DELETE** `/projects/<project_id>`
- **Description**: Delete a specific project (owned by the user).
- **Headers**: As specified in the General Requirements.
- **Body**: None.

---

### Image Management

#### Upload an Image
**POST** `/projects/<project_id>/images`
- **Description**: Upload an image to a specific project's source bucket.
- **Headers**: As specified in the General Requirements.
- **Body**:
  ```json
  {
      "file": "<base64_encoded_file_data>"
  }
  ```

#### Retrieve All Processed Image Links
**GET** `/projects/<project_id>/images`
- **Description**: Retrieve all processed image links from a project's output bucket.
- **Headers**: As specified in the General Requirements.
- **Body**: None.

#### Delete an Image
**DELETE** `/projects/<project_id>/images/<image_id>`
- **Description**: Delete a specific image from a project's source bucket.
- **Headers**: As specified in the General Requirements.
- **Body**: None.

---

### Tool Management

#### Retrieve All Tools
**GET** `/projects/<project_id>/tools`
- **Description**: Retrieve all tools associated with a specific project.
- **Headers**: As specified in the General Requirements.
- **Body**: None.

#### Add a New Tool
**POST** `/projects/<project_id>/tools`
- **Description**: Add a new tool to a specific project. If the position is changed for the position of other tool all other tools are shifted forward.
- **Headers**: As specified in the General Requirements.
- **Body**:
  ```json
  {
      "position": 1,
      "procedure":"bezel"
      "parameters": {
          "key1": "value1",
          "key2": "value2"
      }
  }
  ```

#### Update a Tool
**PUT** `/projects/<project_id>/tools/<tool_id>`
- **Description**: Update a specific tool's configuration for a project. If the position is changed for the position of other tool all other tools are shifted forward.
- **Headers**: As specified in the General Requirements.
- **Body**:
  ```json
  {
      "position": 2,
      "configuration": {
          "key1": "new_value1",
          "key2": "new_value2"
      }
  }
  ```

#### Delete a Tool
**DELETE** `/projects/<project_id>/tools/<tool_id>`
- **Description**: Remove a specific tool from a project.
- **Headers**: As specified in the General Requirements.
- **Body**: None.

---

### Project Processing and Status

#### Start Project Processing
**POST** `/projects/<project_id>/process`
- **Description**: Start the processing workflow for a specific project.
- **Headers**: As specified in the General Requirements.
- **Body**: None.

#### Get Project Status
**GET** `/projects/<project_id>/status`
- **Description**: Retrieve the processing status of a specific project. TODO
- **Headers**: As specified in the General Requirements.
- **Body**: None.

---
