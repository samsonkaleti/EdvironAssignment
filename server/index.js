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
    origin:[ "https://edviron-assignment-weld.vercel.app","http://localhost:5173"], 
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  })
);
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
