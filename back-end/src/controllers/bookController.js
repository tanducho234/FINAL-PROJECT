// controllers/bookController.js
const bookRepository = require("../repositories/bookRepository");

class BookController {
    async createBook(req, res) {
        try {
            const { title, author, genre, ISBN } = req.body;
            const owner = req.user.id
            const book = await bookRepository.createBook(
                {
                    title,
                    author,
                    genre,
                    ISBN,
                    owner
                }
            );
            res.status(201).json(book);
        } catch (err) {
            res.status(500).json({ error: "Unable to create the book" });
        }
    }

    async getAllBooksByOwner(req, res) {
        try {
            const books = await bookRepository.getAllBooksByOwnerId(req.user.id);
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: "Unable to fetch books" });
        }
    }

    async getBookById(req, res) {
        try {
            const book = await bookRepository.getBookById(req.params.id);
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: "Unable to fetch the book" });
        }
    }

    async updateBook(req, res) {
        try {
            const book = await bookRepository.updateBook(
                req.params.id,
                req.body
            );
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: "Unable to update the book" });
        }
    }

    async deleteBook(req, res) {
        try {
            const book = await bookRepository.deleteBook(req.params.id);
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json({ error: "Unable to delete the book" });
        }
    }
}

module.exports = new BookController();