# CONVIEW - Social Media Application

A full-stack social media application with Node.js backend and MongoDB database.

## Features

- User registration and authentication with password hashing
- User profiles with customizable information
- Social posts and feed
- Friends system
- Real-time online status
- RESTful API backend

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher) - [Download MongoDB](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CONVIEW
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` if needed (default settings work for local development):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/conview
SESSION_SECRET=your-secret-key-change-in-production
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or start manually from installation directory
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 5. Initialize Database (Optional)

Populate the database with demo users and posts:

```bash
npm run init-db
```

This creates three demo users:
- **Username:** Alice, **Password:** password123
- **Username:** Bob, **Password:** password123
- **Username:** NotesGroup, **Password:** password123

### 6. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 7. Access the Application

Open your web browser and navigate to:
```
http://localhost:3000/index.html
```

## Usage

### First Time Setup
1. Open `http://localhost:3000/index.html` in your browser
2. Click "Create New Account" to register
3. Login with your credentials or use demo credentials
4. You'll be redirected to the home page

### Features Walkthrough

#### Registration & Login
- **Register**: Create a new account with username (3-30 characters) and password (min 6 characters)
- **Login**: Access your account securely with hashed password verification

#### Home Page
- **Post Updates**: Share thoughts and updates with your network
- **View Feed**: See posts from yourself and friends
- **View Friends**: See your friends list in the sidebar
- **Edit Profile**: Click "Profile" to update your information
- **Search**: Filter friends and posts
- **Logout**: Safely logout of your account

#### Profile Page
- **View Profile**: See complete user information
- **Edit Information**: Update bio, name, birth date, relationship status
- **Save Changes**: Changes are persisted to the database
- **Navigate Back**: Return to home page

## API Documentation

### Authentication Endpoints

#### POST /register
Register a new user
```json
{
  "username": "string",
  "password": "string"
}
```

#### POST /login
Login user
```json
{
  "username": "string",
  "password": "string"
}
```

#### POST /logout
Logout user
```json
{
  "username": "string"
}
```

### User Endpoints

#### GET /api/users/:username
Get user profile

#### PUT /api/users/:username
Update user profile
```json
{
  "bio": "string",
  "firstname": "string",
  "lastname": "string",
  "dob": "string",
  "relation": "string",
  "statusvalue": "string"
}
```

#### GET /api/users
Get all users

#### GET /api/users/:username/friends
Get user's friends list

#### POST /api/users/:username/friends
Add a friend
```json
{
  "friendUsername": "string"
}
```

### Post Endpoints

#### POST /api/posts
Create a post
```json
{
  "username": "string",
  "content": "string"
}
```

#### GET /api/posts
Get all posts (or filter by username with ?username=)

#### DELETE /api/posts/:postId
Delete a post
```json
{
  "username": "string"
}
```

### Health Check

#### GET /api/health
Check server and database status

## Technical Details

### Architecture
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Password hashing with bcryptjs
- **Validation**: express-validator for input validation
- **Security**: CORS enabled, input sanitization

### Database Models

#### User Model
- username (unique, 3-30 chars)
- password (hashed)
- online status
- profile information (bio, firstname, lastname, dob, relation, status)
- friends array (references to other users)

#### Post Model
- author (reference to User)
- content (max 1000 chars)
- timestamp
- likes and comments arrays

### Security Features
- Password hashing with bcrypt (10 salt rounds)
- Input validation and sanitization
- Protected password field (not returned in API responses)
- CORS configuration
- Environment variable configuration

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Responsive**: Works on tablets and smartphones

## Development

### Project Structure
```
CONVIEW/
├── models/              # Database models
│   ├── User.js         # User schema
│   └── Post.js         # Post schema
├── server.js           # Express server and API endpoints
├── init-db.js          # Database initialization script
├── index.html          # Login page
├── register.html       # Registration page
├── home.html           # Home/feed page
├── profile.html        # Profile page
├── script.js           # Login page JavaScript
├── register.js         # Registration page JavaScript
├── style.css           # Styles
├── package.json        # Dependencies and scripts
├── .env                # Environment configuration (not in git)
└── .env.example        # Example environment file
```

### Available Scripts

- `npm start` - Start the backend server
- `npm run init-db` - Initialize database with demo data
- `npm test` - Run tests (currently placeholder)

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoDB connection error"**
- Ensure MongoDB is installed and running
- Check MongoDB is accessible at `mongodb://localhost:27017`
- Verify `.env` file has correct MONGODB_URI

**Check MongoDB status:**
```bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
# Check Services app for MongoDB service
```

### Port Already in Use

**Error: "Port 3000 is already in use"**
- Change PORT in `.env` file
- Or stop the process using port 3000

### Cannot Connect to Server from Browser

- Ensure server is running (`npm start`)
- Check server console for errors
- Try accessing `http://localhost:3000/api/health`
- Check browser console for CORS errors

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
