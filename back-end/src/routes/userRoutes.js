// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/profile", userController.profile);
router.post("/profile", userController.updateProfile);
//get account balance
router.get("/balance", userController.getAccountBalance);
router.post("/update-balance", userController.updateAccountBalance);
    

module.exports = router;