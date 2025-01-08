const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const routes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const http = require("http"); // Import the HTTP module
const { Server } = require("socket.io"); // Import the Socket.IO server

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Connect to the database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Create an HTTP server instance and integrate it with the app
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Emit real-time data periodically
  const interval = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      value: Math.random() * 100, // Simulated random data
    };
    socket.emit("real-time-data", data);
  }, 1000);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    clearInterval(interval); // Clear the interval when the user disconnects
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
