const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); 
const routes = require('./routes/index')
const app = express();
dotenv.config();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Connect to database
connectDB(); 

// Routes
app.use('/api', routes);


const PORT = process.env.PORT || 5000;
console.log(`Configured port: ${PORT}`);

try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
}
