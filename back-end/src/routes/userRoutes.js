// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register a new user
router.get("/profile", userController.profile);
router.post("/profile", userController.updateProfile);


module.exports = router;