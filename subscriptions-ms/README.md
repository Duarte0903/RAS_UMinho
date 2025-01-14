# Subscriptions API Routes

This document provides an overview of the Subscriptions API routes. These routes are used to manage subscription data.

## Base URL
All subscription routes are prefixed with `/subscriptions`.

---

## Endpoints

### 1. **Create a Subscription**

**POST** `/subscriptions`

Creates a new subscription.

#### Request Body:
```json
{
  "user_id": "<user UUID>",
  "type": "monthly", // or "annual"
  "state": "active" // or "inactive"
}
```

#### Response:
- **201 Created**: Subscription created successfully.
- **500 Internal Server Error**: Error creating subscription.

---

### 2. **Get All Subscriptions**

**GET** `/subscriptions`

Retrieves all subscriptions, sorted by creation time.

#### Query Parameters:
- `order` (string): Sorting order, either `mostRecent` or `leastRecent`. Default is `mostRecent`.

#### Response:
- **200 OK**: Returns a list of all subscriptions.
- **500 Internal Server Error**: Error fetching subscriptions.

---

### 3. **Get Subscription by ID**

**GET** `/subscriptions/:id`

Retrieves a specific subscription by its unique ID.

#### URL Parameters:
- `id` (string): The ID of the subscription.

#### Response:
- **200 OK**: Returns the requested subscription.
- **404 Not Found**: Subscription not found.
- **500 Internal Server Error**: Error fetching subscription.

---

### 4. **Get Subscription by User ID**

**GET** `/subscriptions/user/:user_id`

Retrieves a subscription by the user ID.

#### URL Parameters:
- `user_id` (string): The ID of the user associated with the subscription.

#### Response:
- **200 OK**: Returns the requested subscription.
- **404 Not Found**: Subscription not found.
- **500 Internal Server Error**: Error fetching subscription.

---

### 5. **Get Subscriptions by Type**

#### Monthly Subscriptions
**GET** `/subscriptions/type/monthly`

Retrieves all monthly subscriptions.

#### Annual Subscriptions
**GET** `/subscriptions/type/annual`

Retrieves all annual subscriptions.

#### Response:
- **200 OK**: Returns a list of subscriptions by type.
- **500 Internal Server Error**: Error fetching subscriptions.

---

### 6. **Get Subscriptions by Date**

#### By Day
**GET** `/subscriptions/date/day/:day`

Retrieves subscriptions created on a specific day.

#### By Month
**GET** `/subscriptions/date/month/:month`

Retrieves subscriptions created in a specific month.

#### By Year
**GET** `/subscriptions/date/year/:year`

Retrieves subscriptions created in a specific year.

#### URL Parameters:
- `day`, `month`, `year`: Date values for filtering subscriptions.

#### Response:
- **200 OK**: Returns a list of subscriptions by date.
- **500 Internal Server Error**: Error fetching subscriptions.

---

### 7. **Get Subscriptions by State**

#### Active Subscriptions
**GET** `/subscriptions/state/active`

Retrieves all active subscriptions.

#### Inactive Subscriptions
**GET** `/subscriptions/state/inactive`

Retrieves all inactive subscriptions.

#### Response:
- **200 OK**: Returns a list of subscriptions by state.
- **500 Internal Server Error**: Error fetching subscriptions.

---

### 8. **Update a Subscription**

**PUT** `/subscriptions/:id`

Updates a specific subscription by its unique ID.

#### URL Parameters:
- `id` (string): The ID of the subscription.

#### Request Body:
- Any field(s) to update, e.g.,
```json
{
  "type": "annual",
  "state": "inactive"
}
```

#### Response:
- **200 OK**: Subscription updated successfully.
- **404 Not Found**: Subscription not found.
- **500 Internal Server Error**: Error updating subscription.

---

### 9. **Update a Subscription by User ID**

**PUT** `/subscriptions/user/:user_id`

Updates a subscription by the user ID.

#### URL Parameters:
- `user_id` (string): The ID of the user associated with the subscription.

#### Request Body:
- Any field(s) to update, e.g.,
```json
{
  "type": "monthly",
  "state": "active"
}
```

#### Response:
- **200 OK**: Subscription updated successfully.
- **404 Not Found**: Subscription not found.
- **500 Internal Server Error**: Error updating subscription.

---

### 10. **Delete a Subscription by ID**

**DELETE** `/subscriptions/:id`

Deletes a specific subscription by its unique ID.

#### URL Parameters:
- `id` (string): The ID of the subscription.

#### Response:
- **200 OK**: Subscription deleted successfully.
- **404 Not Found**: Subscription not found.
- **500 Internal Server Error**: Error deleting subscription.

---

### 11. **Delete a Subscription by User ID**

**DELETE** `/subscriptions/user/:user_id`

Deletes a subscription by the user ID.

#### URL Parameters:
- `user_id` (string): The ID of the user associated with the subscription.

#### Response:
- **200 OK**: Subscription deleted successfully.
- **404 Not Found**: Subscription not found.
- **500 Internal Server Error**: Error deleting subscription.

---

### 12. **Delete All Subscriptions**

**DELETE** `/subscriptions`

Deletes all subscriptions in the system.

#### Response:
- **200 OK**: All subscriptions deleted successfully.
- **500 Internal Server Error**: Error deleting subscriptions.






-------------------------------------------------------------------------------------------------------
# Payments API Routes

This document provides an overview of the Payment API routes. These routes are used to manage payments associated with subscriptions.

## Base URL
All payment routes are prefixed with `/payments`.

---

## Endpoints

### 1. **Create a Payment**

**POST** `/payments`

Creates a new payment.

#### Request Body:
```json
{
  "subscription_id": "<subscription UUID>",
  "extra": {
    "key": "value" // Additional Stripe-related information
  }
}
```

#### Response:
- **201 Created**: Payment created successfully.
- **500 Internal Server Error**: Error creating payment.

---

### 2. **Get All Payments**

**GET** `/payments`

Retrieves all payments, sorted by creation time (most recent first).

#### Response:
- **200 OK**: Returns a list of all payments.
- **500 Internal Server Error**: Error fetching payments.

---

### 3. **Get Payment by ID**

**GET** `/payments/:id`

Retrieves a specific payment by its unique ID.

#### URL Parameters:
- `id` (string): The ID of the payment.

#### Response:
- **200 OK**: Returns the requested payment.
- **404 Not Found**: Payment not found.
- **500 Internal Server Error**: Error fetching payment.

---

### 4. **Get Payments by Subscription ID**

**GET** `/payments/subscription/:subscription_id`

Retrieves all payments for a specific subscription.

#### URL Parameters:
- `subscription_id` (string): The ID of the subscription.

#### Response:
- **200 OK**: Returns a list of payments for the subscription.
- **500 Internal Server Error**: Error fetching payments.

---

### 5. **Update a Payment by ID**

**PUT** `/payments/:id`

Updates a specific payment by its unique ID.

#### URL Parameters:
- `id` (string): The ID of the payment.

#### Request Body:
- Any field(s) to update, e.g.,
```json
{
  "extra": {
    "updated_key": "updated_value"
  }
}
```

#### Response:
- **200 OK**: Payment updated successfully.
- **404 Not Found**: Payment not found.
- **500 Internal Server Error**: Error updating payment.

---

### 6. **Delete a Payment by ID**

**DELETE** `/payments/:id`

Deletes a specific payment by its unique ID.

#### URL Parameters:
- `id` (string): The ID of the payment.

#### Response:
- **200 OK**: Payment deleted successfully.
- **404 Not Found**: Payment not found.
- **500 Internal Server Error**: Error deleting payment.

---

### 7. **Delete All Payments for a Subscription ID**

**DELETE** `/payments/subscription/:subscription_id`

Deletes all payments associated with a specific subscription.

#### URL Parameters:
- `subscription_id` (string): The ID of the subscription.

#### Response:
- **200 OK**: All payments for the subscription deleted successfully.
- **500 Internal Server Error**: Error deleting payments.

---

### 8. **Delete All Payments**

**DELETE** `/payments`

Deletes all payments in the system.

#### Response:
- **200 OK**: All payments deleted successfully.
- **500 Internal Server Error**: Error deleting payments.

