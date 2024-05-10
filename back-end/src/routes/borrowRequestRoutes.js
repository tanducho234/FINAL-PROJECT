/**
 * @swagger
 * tags:
 *   name: Borrow Requests
 *   description: APIs for managing borrow requests
 */

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: Create a new borrow request
 *     description: Create a new borrow request with the provided details.
 *     tags: [Borrow Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               lenderId:
 *                 type: string
 *             example:
 *               bookId: "60f30fbd85a35a0015d281f8"
 *               lenderId: "609e2c5d2c64a8001548a08a"
 *     responses:
 *       '200':
 *         description: Borrow request created successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /borrow:
 *   get:
 *     summary: Get all borrow requests by lender
 *     description: Retrieve all borrow requests made to the authenticated user as a lender.
 *     tags: [Borrow Requests]
 *     responses:
 *       '200':
 *         description: Borrow requests retrieved successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /borrow/accept/{id}:
 *   get:
 *     summary: Accept a borrow request
 *     description: Accept a borrow request by its ID.
 *     tags: [Borrow Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the borrow request to accept
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Borrow request accepted successfully
 *       '404':
 *         description: Borrow request not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /borrow/reject/{id}:
 *   get:
 *     summary: Reject a borrow request
 *     description: Reject a borrow request by its ID.
 *     tags: [Borrow Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the borrow request to reject
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Borrow request rejected successfully
 *       '404':
 *         description: Borrow request not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /borrow/delete/{id}:
 *   get:
 *     summary: Delete a borrow request
 *     description: Delete a borrow request by its ID.
 *     tags: [Borrow Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the borrow request to delete
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Borrow request deleted successfully
 *       '404':
 *         description: Borrow request not found
 *       '500':
 *         description: Internal server error
 */
// routes/borrowRequestRoutes.js

const express = require("express");
const router = express.Router();
const borrowRequestController = require("../controllers/borrowRequestController");

// Route for creating a new borrow request
router.post("/", borrowRequestController.createBorrowRequest);

//route for get all borrow request by lender
router.get("/", borrowRequestController.getAllBorrowRequestsByUserId);

// Route for accepting a borrow request
router.get("/accept/:id", borrowRequestController.acceptBorrowRequest);

// Route for declining a borrow request
router.get("/reject/:id", borrowRequestController.rejectBorrowRequest);
//delete
router.get("/delete/:id", borrowRequestController.deleteBorrowRequest);

module.exports = router;
