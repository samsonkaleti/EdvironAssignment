const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const routes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: "https://edviron-assignment-samsonkaletis-projects.vercel.app", // Replace with your frontend URL in production
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  })
);
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
