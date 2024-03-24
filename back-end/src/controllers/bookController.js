// controllers/bookController.js
const bookRepository = require("../repositories/bookRepository");
// repositories/BookRepository.js
const Book = require("../models/book");
const { upload, bucket } = require('../../config/firebase');

class BookController {
    async createBook(req, res) {
        console.log("UPLOAD file", req.file)
      
        ///////
        try {
            const { title, author, genres, ISBN, desc } = req.body;
            const genresArray = genres.split(',')
            console.log('genres', genresArray)
            ///////upload image
            if (!req.file) {
                console.log("UPLOAD2")
                console.log('req.image', req.image)
                return res.status(400).json({ message: 'No file uploaded' });
            }
            const fileName = Date.now() + req.file.originalname;
            const file = bucket.file(fileName);

            // Upload the file to Firebase Storage
            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            // Get the image path
            const imagePath = `${fileName}`;

            ////

            const ownerId = req.user.id
            const book = await bookRepository.createBook(
                {
                    title,
                    author,
                    genres: genresArray,
                    ISBN,
                    ownerId,
                    imagePath,
                }
            );
            console.log('asdasdasda')
            res.status(201).json(book);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: "Unable to create the book" });
        }
    }

    async getAllBooksByOwner(req, res) {
        try {
            console.log('getAllBooksByOwner', req.user.id)
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