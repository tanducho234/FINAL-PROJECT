// controllers/bookController.js
const bookRepository = require("../repositories/bookRepository");
// repositories/BookRepository.js
const Book = require("../models/book");
const { upload, bucket, getCachedViewLink } = require("../../config/firebase");
const userRepository = require("../repositories/userRepository");

class BookController {
  async createBook(req, res) {
    ///////
    try {
      const { title, author, genres, ISBN, desc, depositFee } = req.body;
      const genresArray = genres.split(",");
      console.log("genres", genresArray);
      ///////upload image
      if (!req.file) {
        console.log("UPLOAD2");
        console.log("req.image", req.image);
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileName = Date.now() + req.file.originalname;
      const file = bucket.file(fileName);

      // Upload the file to Firebase Storage
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Get the image path
      const imagePath = `${fileName}`;

      ////

      const ownerId = req.user.id;
      const book = await bookRepository.createBook({
        title,
        author,
        genres: genresArray,
        ISBN,
        ownerId,
        imagePath,
        desc,
        depositFee,
      });
      console.log("asdasdasda");
      res.status(201).json({ message: "Book added successfully." });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Unable to create the book" });
    }
  }

  async getAllBooksByOwner(req, res) {
    try {
      console.log("getAllBooksByOwner", req.user.id);
      const books = await bookRepository.getAllBooksByOwnerId(req.user.id);
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: "Unable to fetch books" });
    }
  }

  async getAllBooks(req, res) {
    try {
      const currentUserId = req.user.id;
      const books = await bookRepository.getAllBooks();

      // Map over each book and generate view links for image paths
      const booksWithViewLinks = await Promise.all(
        books.map(async (book) => {
          const bookViewLink = await getCachedViewLink(book.imagePath); // Generate view link for book image
          const ownerViewLink = await getCachedViewLink(book.ownerId.imagePath); // Generate view link for owner image
          return {
            ...book.toObject(), // Convert Mongoose document to plain JavaScript object
            viewLink: bookViewLink,
            ownerId: {
              _id: book.ownerId._id,
              firstName: book.ownerId.firstName,
              lastName: book.ownerId.lastName,
              viewLink: ownerViewLink,
            },
          };
        })
      );
      const booksWithoutCurrentUser = booksWithViewLinks.filter(
        (book) => book.ownerId._id != currentUserId
      );
      const user= await userRepository.getUserById(currentUserId)
      // console.log("Number of books:", booksWithoutCurrentUser.length); // Log the number of books
      res.json({books:booksWithoutCurrentUser,favoriteBooks:user.favoriteBooks});
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch books" });
    }
  }

  async getBookById(req, res) {
    try {
      const book = await bookRepository.getBookById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      console.log("getBookById", book);
      res.json(book);
    } catch (err) {
      res.status(500).json({ message: "Unable to fetch the book" });
    }
  }

  async updateBook(req, res) {
    console.log("updateBook11212", req.body.title);

    try {
      const book = await bookRepository.updateBook(req.params.id, req.body);
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
