// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const productRoutes = require("./src/routes/productRoutes");
const connectToDatabase = require("./config/database");
const userRoutes = require("./src/routes/userRoutes");
const bookRoutes = require("./src/routes/bookRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
const authMiddleware = require("./src/middlewares/authMiddleware");


// Connect to MongoDB
connectToDatabase();

// Routes
app.use("/users", userRoutes);
app.use("/books",authMiddleware, bookRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});