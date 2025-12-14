const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    online: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500
    },
    firstname: {
        type: String,
        default: '',
        maxlength: 50
    },
    lastname: {
        type: String,
        default: '',
        maxlength: 50
    },
    dob: {
        type: String,
        default: ''
    },
    relation: {
        type: String,
        default: 'Single',
        enum: ['Single', 'In a relationship', 'Married', 'Complicated', '']
    },
    statusvalue: {
        type: String,
        default: 'Online',
        maxlength: 100
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
