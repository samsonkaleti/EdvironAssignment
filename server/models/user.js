const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { 
            type: String, 
            enum: ['user', 'admin'], // Define roles like 'user' and 'admin'
            default: 'user' 
        }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the User model
module.exports = mongoose.model('User', userSchema);
