require('dotenv').config();
const jwt = require('jsonwebtoken');

// Define the payload (dummy user or data for testing purposes)
const payload = {
    id: 'user123', // Dummy ID
    name: 'Test User', // Dummy name
    role: 'admin' // Optional: role-based access (if needed)
};

// Generate the token
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('Generated Token:', token);
