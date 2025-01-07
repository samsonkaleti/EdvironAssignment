const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const signup = async ({ username, email, password }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newAdmin = await User.create({ 
        username, 
        email, 
        password: hashedPassword 
    });

    return { id: newAdmin._id, username: newAdmin.username, email: newAdmin.email };
};


const login = async ({ email, password }) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Debugging: Log the user details
    console.log('User found:', user);

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log('Generated token:', token);

    return { token, username: user.username };
};


module.exports = { signup, login };
