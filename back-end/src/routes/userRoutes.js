// routes/userRoutes.js
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile information of the authenticated user.
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 */

/**
 * @swagger
 * /api/users/profile:
 *   post:
 *     summary: Update user profile
 *     description: Update the profile information of the authenticated user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               dob: 1990-01-01
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 */

/**
 * @swagger
 * /api/users/balance:
 *   get:
 *     summary: Get account balance
 *     description: Retrieve the account balance of the authenticated user.
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Account balance retrieved successfully
 */

/**
 * @swagger
 * /api/users/balance:
 *   post:
 *     summary: Update account balance
 *     description: Update the account balance of the authenticated user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *             example:
 *               amount: 100
 *     responses:
 *       '200':
 *         description: Account balance updated successfully
 */

/**
 * @swagger
 * /api/users/favourite-book:
 *   post:
 *     summary: Add book to favourite list
 *     description: Add a book to the authenticated user's favourite list.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *             example:
 *               bookId: "60f30fbd85a35a0015d281f8"
 *     responses:
 *       '200':
 *         description: Book added to favourite list successfully
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router.get("/profile", userController.profile);
router.post("/profile", userController.updateProfile);
//get account balance
router.get("/balance", userController.getAccountBalance);
router.post("/balance", userController.updateAccountBalance);

//add bookid to favouriteBooks
router.post("/favourite-book", userController.updateFavouriteBookList);

module.exports = router;
