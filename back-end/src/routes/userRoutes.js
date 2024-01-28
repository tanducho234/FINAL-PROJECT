// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register a new user
router.post("/register", userController.registerUser);

// User verify
router.get("/verify", userController.verifyUser);

// Login user and get JWT token
router.post("/login", userController.loginUser);




module.exports = router;