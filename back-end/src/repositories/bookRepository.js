// repositories/BookRepository.js
const Book = require("../models/book");

class BookRepository {
  async createBook(data) {
    return await Book.create(data);
  }

  async getAllBooks() {
    return await Book.find().populate("ownerId").populate("genres");
  }

  async getAllBooksByOwnerId(userId) {
    return await Book.find({ ownerId: userId })
      .populate("ownerId")
      .populate("genres");
  }
  async getAllBooksExceptOwnerId(userId) {
    return await Book.find({ ownerId: { $ne: userId } })
      .populate("ownerId")
      .populate("genres");
  }

  async getBookById(id) {
    return await Book.findById(id).populate("genres");
  }

  async updateBook(id, data) {
    return await Book.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBook(id) {
    return await Book.findByIdAndDelete(id);
  }
  //add comment for book
  async addComment(id, comment, userId) {
    return await Book.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            userId: userId,
            comment: comment,
          },
        },
      },
      { new: true }
    );
  }
  async getComments(id) {
    try {
      const book = await Book.findById(id).populate("comments.userId");
      
      // Sort comments by creation date
      book.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return book.comments;
  } catch (error) {
      console.error("Error retrieving comments:", error);
      throw error;
  }
  }
}
module.exports = new BookRepository();
