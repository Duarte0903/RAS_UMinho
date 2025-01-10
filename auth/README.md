# Auth server for PictuRAS

## Registration

- `POST /register`: Creates a new user account.

## Login

- `POST /login`: Grants the user access to the site if the authentication fields are correct and returns an authentication *token*.

## Change Password

- `POST /password`: This POST request is triggered when a user attempts to update their password. Requires the original password to change to a new one. After verifying the user's *token* and authentication, the user's password is updated.

## Delete User

- `DELETE /:_id`: Verifies the *token* and, based on the user's *id*, deletes all their data from the database.
