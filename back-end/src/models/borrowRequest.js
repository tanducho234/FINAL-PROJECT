// borrowRequest.js

const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  startDate: { type: Date },
  returnDate: { type: Date},
  createdAt: { type: Date, default: Date.now },
  depositFee: { type: Number, default: 0 },
});

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);

module.exports = BorrowRequest;