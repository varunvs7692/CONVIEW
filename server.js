// Node.js + Express backend with MongoDB database

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

// Rate limiting configuration
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: 'Too many attempts, please try again later.' }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Security middleware to prevent serving sensitive files
app.use((req, res, next) => {
    const allowedExtensions = ['.html', '.css', '.js', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.svg'];
    const isDotfile = req.path.startsWith('/.');
    const hasAllowedExtension = allowedExtensions.some(ext => req.path.endsWith(ext));
    
    // Block dotfiles and files without allowed extensions (when requesting static files)
    if (isDotfile || (!hasAllowedExtension && !req.path.startsWith('/api/') && !req.path.includes('/register') && !req.path.includes('/login') && !req.path.includes('/logout'))) {
        // Skip to next middleware for API routes, allow static files with safe extensions
        if (req.path.startsWith('/api/') || req.path.includes('/register') || req.path.includes('/login') || req.path.includes('/logout')) {
            return next();
        }
        // Check if requesting a static file with unsafe extension
        const hasExtension = req.path.includes('.');
        if (hasExtension && !hasAllowedExtension) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
    }
    next();
});

// Serve static files (dotfiles are blocked by middleware above)
app.use(express.static('.', {
    dotfiles: 'deny',
    index: false
}));

// Database connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/conview';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Server will continue without database. API endpoints will return errors.');
    }
};

connectDB();

// Validation middleware
const validateRegistration = [
    body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
    body('password').isLength({ min: 6 })
];

const validateLogin = [
    body('username').trim().notEmpty(),
    body('password').notEmpty()
];

const validatePost = [
    body('content').trim().isLength({ min: 1, max: 1000 })
];

const validateProfile = [
    body('bio').optional().isLength({ max: 500 }),
    body('firstname').optional().isLength({ max: 50 }),
    body('lastname').optional().isLength({ max: 50 }),
    body('statusvalue').optional().isLength({ max: 100 })
];

// Auth endpoints
app.post('/register', authLimiter, validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid input. Username must be 3-30 alphanumeric characters, password at least 6 characters.' 
            });
        }

        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }

        // Create new user
        const user = new User({ username, password });
        await user.save();

        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

app.post('/login', authLimiter, validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Update online status
        user.online = true;
        await user.save();

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

app.post('/logout', apiLimiter, async (req, res) => {
    try {
        const { username } = req.body;
        if (username) {
            const user = await User.findOne({ username });
            if (user) {
                user.online = false;
                await user.save();
            }
        }
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Server error during logout' });
    }
});

// User/Profile endpoints
app.get('/api/users/:username', apiLimiter, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: user.toJSON() });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/users/:username', apiLimiter, validateProfile, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Invalid profile data' });
        }

        const { bio, firstname, lastname, dob, relation, statusvalue } = req.body;
        
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields
        if (bio !== undefined) user.bio = bio;
        if (firstname !== undefined) user.firstname = firstname;
        if (lastname !== undefined) user.lastname = lastname;
        if (dob !== undefined) user.dob = dob;
        if (relation !== undefined) user.relation = relation;
        if (statusvalue !== undefined) user.statusvalue = statusvalue;

        await user.save();
        res.json({ success: true, message: 'Profile updated', user: user.toJSON() });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/users', apiLimiter, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Posts endpoints
app.post('/api/posts', apiLimiter, validatePost, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Post content is required (max 1000 characters)' });
        }

        const { username, content } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const post = new Post({
            author: user._id,
            authorUsername: username,
            content
        });

        await post.save();
        res.json({ success: true, message: 'Post created', post });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/posts', apiLimiter, async (req, res) => {
    try {
        const { username } = req.query;
        let query = {};
        
        if (username) {
            query.authorUsername = username;
        }

        const posts = await Post.find(query)
            .sort({ timestamp: -1 })
            .populate('author', 'username firstname lastname')
            .limit(100);

        res.json({ success: true, posts });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.delete('/api/posts/:postId', apiLimiter, async (req, res) => {
    try {
        const { username } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.authorUsername !== username) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.postId);
        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Friends endpoints
app.post('/api/users/:username/friends', apiLimiter, async (req, res) => {
    try {
        const { friendUsername } = req.body;
        
        const user = await User.findOne({ username: req.params.username });
        const friend = await User.findOne({ username: friendUsername });

        if (!user || !friend) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.friends.includes(friend._id)) {
            user.friends.push(friend._id);
            await user.save();
        }

        res.json({ success: true, message: 'Friend added' });
    } catch (error) {
        console.error('Add friend error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/users/:username/friends', apiLimiter, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .populate('friends', 'username firstname lastname bio online statusvalue');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, friends: user.friends });
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`Database status: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
});