// Database initialization script
// This script creates demo users and sample posts for testing

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const demoUsers = [
    {
        username: 'Alice',
        password: 'password123',
        bio: 'Love reading and music',
        firstname: 'Alice',
        lastname: 'Johnson',
        dob: '1995-03-15',
        relation: 'Single',
        statusvalue: 'Reading a great book!',
        online: true
    },
    {
        username: 'Bob',
        password: 'password123',
        bio: 'Aspiring developer',
        firstname: 'Bob',
        lastname: 'Smith',
        dob: '1998-07-22',
        relation: 'Single',
        statusvalue: 'Coding all day',
        online: false
    },
    {
        username: 'NotesGroup',
        password: 'password123',
        bio: 'Share your notes here',
        firstname: 'Notes',
        lastname: 'Group',
        dob: '2020-01-01',
        relation: '',
        statusvalue: 'Group for sharing notes',
        online: true
    }
];

const demoPosts = [
    { username: 'Alice', content: 'Just finished reading an amazing book! 📚' },
    { username: 'Bob', content: 'Learning Node.js and MongoDB today. Exciting stuff!' },
    { username: 'Alice', content: 'Anyone have music recommendations?' },
    { username: 'NotesGroup', content: 'Welcome to the notes sharing group!' }
];

async function initDatabase() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/conview';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Clear existing data (optional - comment out to keep existing data)
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create demo users
        console.log('Creating demo users...');
        const createdUsers = [];
        for (const userData of demoUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
            console.log(`Created user: ${user.username}`);
        }

        // Set up friendships
        console.log('Setting up friendships...');
        const alice = createdUsers.find(u => u.username === 'Alice');
        const bob = createdUsers.find(u => u.username === 'Bob');
        const notesGroup = createdUsers.find(u => u.username === 'NotesGroup');

        alice.friends = [bob._id, notesGroup._id];
        bob.friends = [alice._id, notesGroup._id];
        notesGroup.friends = [alice._id, bob._id];

        await alice.save();
        await bob.save();
        await notesGroup.save();

        // Create demo posts
        console.log('Creating demo posts...');
        for (const postData of demoPosts) {
            const author = createdUsers.find(u => u.username === postData.username);
            const post = new Post({
                author: author._id,
                authorUsername: author.username,
                content: postData.content
            });
            await post.save();
            console.log(`Created post by ${author.username}`);
        }

        console.log('\nDatabase initialized successfully!');
        console.log('\nDemo credentials:');
        console.log('Username: Alice, Password: password123');
        console.log('Username: Bob, Password: password123');
        console.log('Username: NotesGroup, Password: password123');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

initDatabase();
