# PictuRAS API Gateway

This project implements the API Gateway for **PictuRAS**.

## Environment variables

The application uses several environment variables for configuration. Below is a summary table detailing each variable, its purpose, and default value.

| **Environment Variable**  | **Description**                                    | **Default Value**       |
| --------------------------| -------------------------------------------------- | ----------------------- |
| `SERVER_PORT`             | The port of the API-Gateway server.                | `5003`                  |
| `SECRET_KEY`              | The secret key for the JWT tokens.                 | `picturas`              |
| `PROJECTS_AP`             | The entry point of the projects microservice.      | `http://localhost:5000` |
| `USERS_AP`                | The entry point of the users microservice.         | `http://localhost:5001` |
| `SUBSCRIPTIONS_AP`        | The entry point of the subscriptions microservice. | `http://localhost:5002` |

