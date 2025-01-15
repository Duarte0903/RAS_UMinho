# API Endpoints with Example Bodies

## User Endpoints

### 1. `GET /users` 
**Purpose:** Retrieve details of the logged-in user.

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}
```

### 2. `POST /users`
**Purpose:** Create a new user.

**Body:**
```json
{
  "name": "Rui",
  "email": "user@example.com",
  "password": "secure_password"
}
```

### 3. `PUT /users/name`
**Purpose:** Update the name of the logged-in user.

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}

{
  "name": "Rui Lopes"
}
```

### 4. `PUT /users/email`
**Purpose:** Update the email address of the logged-in user.

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}

{
  "email": "new_email@example.com"
}
```

### 5. `PUT /users/password`
**Purpose:** Update the password of the logged-in user.

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}

{
  "password": "new_secure_password"
}

```

### 6. `PUT /users/type`
**Purpose:** Update the user type (e.g., `anonimo`, `gratuito`, `premium`). Private endpoint (not accessible through the API).

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}

{
  "type": "premium"
}

```

### 7. `POST /users/authenticate`
**Purpose:** Authenticate a user and retrieve a JWT token.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

### 8. `DELETE /users`
**Purpose:** Delete the logged-in user account.

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}
```

### 9. `GET /days`
**Purpose:** Retrieve the current user's daily operations record.

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}
```

### 10. `POST /days`
**Purpose:** Increment the operations count for the current user.

**Headers:**
```json
{
  "Authorization": "Bearer <valid_jwt_token>"
}
```


