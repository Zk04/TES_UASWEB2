// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes"); // Use your inventory routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes); // Use your auth routes

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
