/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: User registration and verification APIs
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information.
 *     tags: [Registration]
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
 *         description: User registered successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /register/verify/{token}:
 *   get:
 *     summary: Verify user registration
 *     description: Verify the user registration using the provided token.
 *     tags: [Registration]
 *     parameters:
 *       - in: path
 *         name: token
 *         description: Registration token received via email
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: User registration verified successfully
 *       '404':
 *         description: Token not found
 *       '500':
 *         description: Internal server error
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register a new user
router.post("/", userController.registerUser);

router.get("/verify/:token", userController.verify);

module.exports = router;
