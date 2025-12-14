# API Testing Guide

This guide provides examples for testing all API endpoints using curl.

## Prerequisites

1. Start MongoDB: `mongod` or `brew services start mongodb-community`
2. Start the server: `npm start`
3. Initialize database (optional): `npm run init-db`

## Authentication Endpoints

### Register a New User

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful"
}
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "online": true,
    "bio": "",
    "firstname": "",
    "lastname": "",
    "dob": "",
    "relation": "Single",
    "statusvalue": "Online",
    "friends": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Logout

```bash
curl -X POST http://localhost:3000/logout \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User/Profile Endpoints

### Get User Profile

```bash
curl http://localhost:3000/api/users/johndoe
```

### Update User Profile

```bash
curl -X PUT http://localhost:3000/api/users/johndoe \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Software developer and tech enthusiast",
    "firstname": "John",
    "lastname": "Doe",
    "dob": "1990-05-15",
    "relation": "Single",
    "statusvalue": "Coding all day!"
  }'
```

### Get All Users

```bash
curl http://localhost:3000/api/users
```

## Friends Endpoints

### Get User's Friends

```bash
curl http://localhost:3000/api/users/johndoe/friends
```

### Add a Friend

```bash
curl -X POST http://localhost:3000/api/users/johndoe/friends \
  -H "Content-Type: application/json" \
  -d '{
    "friendUsername": "Alice"
  }'
```

## Post Endpoints

### Create a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "content": "Just learned about MongoDB and Express! Awesome stack!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Post created",
  "post": {
    "_id": "...",
    "author": "...",
    "authorUsername": "johndoe",
    "content": "Just learned about MongoDB and Express! Awesome stack!",
    "timestamp": "...",
    "likes": [],
    "comments": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Get All Posts

```bash
curl http://localhost:3000/api/posts
```

### Get Posts by Specific User

```bash
curl "http://localhost:3000/api/posts?username=johndoe"
```

### Delete a Post

```bash
curl -X DELETE http://localhost:3000/api/posts/{POST_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe"
  }'
```

## Health Check

### Check Server and Database Status

```bash
curl http://localhost:3000/api/health
```

**Expected Response (with MongoDB running):**
```json
{
  "success": true,
  "message": "Server is running",
  "database": "connected"
}
```

**Expected Response (without MongoDB):**
```json
{
  "success": true,
  "message": "Server is running",
  "database": "disconnected"
}
```

## Testing Workflow Example

Here's a complete workflow to test the full functionality:

```bash
# 1. Check server health
curl http://localhost:3000/api/health

# 2. Register a user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "test123456"}'

# 3. Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "test123456"}'

# 4. Update profile
curl -X PUT http://localhost:3000/api/users/testuser \
  -H "Content-Type: application/json" \
  -d '{"bio": "Test user bio", "firstname": "Test", "lastname": "User"}'

# 5. Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "content": "My first post!"}'

# 6. Get all posts
curl http://localhost:3000/api/posts

# 7. Add a friend (using demo user Alice)
curl -X POST http://localhost:3000/api/users/testuser/friends \
  -H "Content-Type: application/json" \
  -d '{"friendUsername": "Alice"}'

# 8. Get friends list
curl http://localhost:3000/api/users/testuser/friends

# 9. Logout
curl -X POST http://localhost:3000/logout \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

## Error Responses

### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### User Already Exists
```json
{
  "success": false,
  "message": "Username already exists"
}
```

### User Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### Invalid Input
```json
{
  "success": false,
  "message": "Invalid input. Username must be 3-30 alphanumeric characters, password at least 6 characters."
}
```

### Server Error
```json
{
  "success": false,
  "message": "Server error during registration"
}
```

## Using Demo Data

If you ran `npm run init-db`, you can test with these demo credentials:

- Username: **Alice**, Password: **password123**
- Username: **Bob**, Password: **password123**
- Username: **NotesGroup**, Password: **password123**

These users already have friendships and posts set up for testing.
