const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true }],
  ISBN: { type: String, unique: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Available', 'Borrowed'], default: 'Available' },
  imagePath: String,
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  desc: String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
