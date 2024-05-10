/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: APIs for managing transactions
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new transaction with the provided details.
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *             example:
 *               userId: "609e2c5d2c64a8001548a08a"
 *               amount: 100
 *     responses:
 *       '200':
 *         description: Transaction created successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get transaction by ID
 *     description: Retrieve a transaction by its ID.
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID of the transaction to retrieve
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Transaction retrieved successfully
 *       '404':
 *         description: Transaction not found
 *       '500':
 *         description: Internal server error
 */

const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getTransactionById);

module.exports = router;
