const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genres: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
  ],
  ISBN: { type: String, unique: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available",
  },
  imagePath: String,
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  desc: String,
  depositFee: { type: Number, default: 0 },
  
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who made the comment
      comment: String, // Comment content
      createdAt: { type: Date, default: Date.now } // Date of comment creation
    }
  ]
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
