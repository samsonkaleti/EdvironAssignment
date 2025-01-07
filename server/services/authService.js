const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/user');

const signup = async ({ username, email, password }) => {
    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create a new user
    const newAdmin = await Admin.create({ username, email, password });
    return { id: newAdmin._id, username: newAdmin.username, email: newAdmin.email };
};

const login = async ({ email, password }) => {
    // Find the user by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new Error('Invalid email or password');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: admin._id, username: admin.username, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, username: admin.username };
};

module.exports = { signup, login };
