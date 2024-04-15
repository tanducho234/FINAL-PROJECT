const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Refund", "Top-up"],
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
