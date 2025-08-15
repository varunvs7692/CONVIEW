// Simple Node.js + Express backend for login (demo only)

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Dummy users array for demonstration
const users = [{ username: 'user', password: 'pass' }];

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ success: false, message: 'Username already exists' });
    }
    users.push({ username, password });
    res.json({ success: true, message: 'Registration successful' });
});

// Login endpoint updated to use users array
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});