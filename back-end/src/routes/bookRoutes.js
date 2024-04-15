const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { upload, bucket } = require("../../config/firebase");

// Create a new book
router.post("/", upload.single("image"), bookController.createBook);

// Get all books by owner
router.get("/", bookController.getAllBooksByOwner);

router.get("/all", bookController.getAllBooks);

// Get a book by ID
router.get("/:id", bookController.getBookById);

// Update a book by ID
router.post("/:id", bookController.updateBook);

// Delete a book by ID
router.delete("/:id", bookController.deleteBook);

module.exports = router;
