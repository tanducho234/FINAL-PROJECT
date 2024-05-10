/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user and get JWT token
 *     description: Log in a user with the provided credentials and return a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: example_user
 *               password: example_password
 *     responses:
 *       '200':
 *         description: User logged in successfully, JWT token generated
 *       '401':
 *         description: Unauthorized - Invalid credentials
 *       '500':
 *         description: Internal server error
 */

// routes/loginroutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Login user and get JWT token
router.post("/", userController.loginUser);

module.exports = router;
