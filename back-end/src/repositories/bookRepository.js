// repositories/BookRepository.js
const Book = require("../models/book");

class BookRepository {
  async createBook(data) {
    return await Book.create(data);
  }

  async getAllBooksByOwnerId(userId) {
    return await Book.find({ ownerId: userId });
  }

  async getBookById(id) {
    return await Book.findById(id);
  }

  async updateBook(id, data) {
    return await Book.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBook(id) {
    return await Book.findByIdAndDelete(id);
  }
}

module.exports = new BookRepository();