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
      // console.log("genres", genresArray);
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

      const booksWithViewLinks = await Promise.all(
        books.map(async (book) => {
          const viewLink = await getCachedViewLink(book.imagePath); // Generate view link for book image
          return {
            ...book.toObject(), // Convert Mongoose document to plain JavaScript object
            viewLink: viewLink,
          };
        })
      );

      res.json(booksWithViewLinks);
    } catch (err) {
      res.status(500).json({ message: "Unable to fetch books" });
    }
  }

  async getAllBooks(req, res) {
    try {
      const currentUserId = req.user.id;
      const books = await bookRepository.getAllBooksExceptOwnerId(
        currentUserId
      );
      const user = await userRepository.getUserById(currentUserId);
      const favoriteBooks = user.favoriteBooks;

      // Map over each book and generate view links for image paths
      const booksWithViewLinks = await Promise.all(
        books.map(async (book) => {
          const bookViewLink = await getCachedViewLink(book.imagePath); // Generate view link for book image
          const ownerViewLink = await getCachedViewLink(book.ownerId.imagePath); // Generate view link for owner image
          const isFavourite = favoriteBooks.includes(book._id); // Check if book is in user's favoriteBooks array

          return {
            ...book.toObject(), // Convert Mongoose document to plain JavaScript object
            viewLink: bookViewLink,
            isFavourite,
            ownerId: {
              _id: book.ownerId._id,
              firstName: book.ownerId.firstName,
              lastName: book.ownerId.lastName,
              viewLink: ownerViewLink,
            },
          };
        })
      );
       for (let i = booksWithViewLinks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [booksWithViewLinks[i], booksWithViewLinks[j]] = [booksWithViewLinks[j], booksWithViewLinks[i]];
      }
      res.json({
        books: booksWithViewLinks,
        favoriteBooks: user.favoriteBooks,
        userId: user._id,
        userViewLink: await getCachedViewLink(user.imagePath),
        userFullName: user.firstName + " " + user.lastName,
      });
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch books" });
    }
  }

  async getBookById(req, res) {
    try {
      let book = await bookRepository.getBookById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      //get add viewlink to book
      const viewLink = await getCachedViewLink(book.imagePath); // Generate view link for book image
      book = book.toObject();
      book.viewLink = viewLink;
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
  //add new comment for book
  async addComment(req, res) {
    try {
      console.log("addComment", req.body, req.user.id, req.params.id);
      const book = await bookRepository.addComment(
        req.params.id,
        req.body.comment,
        req.user.id
      );
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.status(201).json({ message: "comment added successfully." });
    } catch (err) {
      res.status(500).json({ error: "Unable to add comment" });
    }
  }
  async getComments(req, res) {
    try {
      const comments = await bookRepository.getComments(req.params.id);
      if (!comments) {
        return res.status(404).json({ error: "Book not found" });
      }
      const simplifiedComments = await Promise.all(
        comments.map(async (comment) => {
          const viewLink = await getCachedViewLink(comment.userId.imagePath);
          const day = comment.createdAt.getDate();
          const month = comment.createdAt.getMonth() + 1; // Month is zero-based, so add 1
          const year = comment.createdAt.getFullYear();
          return {
            username: comment.userId.firstName + " " + comment.userId.lastName,
            comment: comment.comment,
            viewLink: viewLink, // Save the view link in viewLink field
            createdAt: `${day}/${month}/${year}`, // Concatenate day, month, and year
          };
        })
      );

      res.json(simplifiedComments);
    } catch (err) {
      res.status(500).json({ error: "Unable to get comments" });
    }
  }
}

module.exports = new BookController();
