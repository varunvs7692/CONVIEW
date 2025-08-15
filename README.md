
## Installation & Setup

1. **Clone or download** the project files to your local machine
2. **No server required** - this is a client-side application
3. **Open `conview.html`** in your web browser to start

## Usage

### First Time Setup
1. Open `conview.html` in your browser
2. Register with a username (or use existing demo users: Alice, Bob)
3. You'll be redirected to the home page

### Demo Users
The application comes with pre-configured demo users:
- **Alice**: Love reading and music
- **Bob**: Aspiring developer  
- **Notes Group**: Share your notes here

### Features Walkthrough

#### Home Page
- **Post Updates**: Use the text area to share thoughts
- **View Friends**: Click on friends in the sidebar to view their profiles
- **Edit Your Profile**: Click the "Profile" button in the header
- **Search**: Use the search bar to filter friends and posts
- **Logout**: Click logout to return to login page

#### Profile Page
- **View Complete Profile**: See all user details
- **Edit Information**: Update bio, name, birth date, relation, status
- **Save Changes**: Click "Save" to persist changes
- **Navigate Back**: Use "Back to Home" button

## Technical Details

### Data Storage
- **LocalStorage**: User sessions and profile data
- **In-Memory Arrays**: Friends list and posts (demo data)
- **JSON Persistence**: Profile changes saved to browser storage

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Responsive**: Works on tablets and smartphones
- **No External Dependencies**: Pure HTML/CSS/JavaScript

### Key JavaScript Functions
- `renderFriendsList()`: Displays friends sidebar
- `renderPostsFeed()`: Shows social media posts
- `showNotification()`: Displays success/error messages
- `getCurrentUser()`: Retrieves current logged-in user
- `renderProfile()`: Loads profile page data

## Customization

### Adding New Users
Edit the `registeredUsers` array in both `home.html` and `profile.html`:

```javascript
let registeredUsers = [
    { username: 'YourName', online: true, bio: 'Your bio here', 
      firstname: 'First', lastname: 'Last', dob: '2000-01-01', 
      relation: 'Single', statusvalue: 'Online' }
];
