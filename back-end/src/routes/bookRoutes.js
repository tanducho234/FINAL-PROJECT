/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management APIs
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: Create a new book with the provided details and image.
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               image: [binary data]
 *               title: Example Book
 *               author: John Doe
 *               description: A sample book description
 *     responses:
 *       '200':
 *         description: Book created successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books by owner
 *     description: Retrieve all books owned by the authenticated user.
 *     tags: [Books]
 *     responses:
 *       '200':
 *         description: Books retrieved successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/all:
 *   get:
 *     summary: Get all books
 *     description: Retrieve all books available in the system.
 *     tags: [Books]
 *     responses:
 *       '200':
 *         description: Books retrieved successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/{id}/comment:
 *   post:
 *     summary: Add comment to a book
 *     description: Add a comment to the specified book.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to add a comment to
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *             example:
 *               comment: This is a great book!
 *     responses:
 *       '200':
 *         description: Comment added successfully
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/{id}/comment:
 *   get:
 *     summary: Get comments for a book
 *     description: Retrieve all comments for the specified book.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to get comments for
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Comments retrieved successfully
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieve a book by its ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to retrieve
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Book retrieved successfully
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/{id}:
 *   post:
 *     summary: Update a book by ID
 *     description: Update a book's details by its ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to update
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               title: Updated Book Title
 *               author: Updated Author
 *               description: Updated book description
 *     responses:
 *       '200':
 *         description: Book updated successfully
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     description: Delete a book by its ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to delete
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Book deleted successfully
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */


const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { upload, bucket } = require("../../config/firebase");

// Create a new book
router.post("/", upload.single("image"), bookController.createBook);

// Get all books by owner
router.get("/", bookController.getAllBooksByOwner);

router.get("/all", bookController.getAllBooks);
router.post("/:id/comment", bookController.addComment);
router.get("/:id/comment", bookController.getComments);
// Get a book by ID
router.get("/:id", bookController.getBookById);

// Update a book by ID
router.post("/:id", bookController.updateBook);

// Delete a book by ID
router.delete("/:id", bookController.deleteBook);

module.exports = router;
