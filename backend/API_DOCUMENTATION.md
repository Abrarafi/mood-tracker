# Mood Tracker API Documentation

## Authentication Endpoints

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate a user and return access tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword123!"
}
```

**Request Headers:**

```
Content-Type: application/json
```

**Success Response (200):**

```json
{
  "message": "Welcome back! You have been logged in successfully.",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "email": "user@example.com",
    "createdAt": "2021-07-20T10:30:00.000Z",
    "updatedAt": "2021-07-20T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**

```json
{
  "message": "Please enter a valid email address"
}
```

**401 Unauthorized - Invalid Credentials:**

```json
{
  "message": "Invalid email or password"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Unable to log in. Please try again."
}
```

**Cookies Set:**

- `accessToken`: JWT access token (15 minutes expiry)
- `refreshToken`: JWT refresh token (7 days expiry)

## Postman Collection

Import the `postman_collection.json` file into Postman to get started with pre-configured requests.

### Environment Variables

Set up the following environment variables in Postman:

- `base_url`: `http://localhost:3001` (or your server URL)
- `access_token`: Will be automatically set after successful login

### Usage Instructions

1. **Import Collection**: Import `postman_collection.json` into Postman
2. **Set Environment**: Create a new environment with the variables above
3. **Test Login**: Use the Login request with valid credentials
4. **Use Tokens**: The access token will be automatically set for authenticated requests

## Server Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:

   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword123!"
  }'

# Get current user (with token)
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
