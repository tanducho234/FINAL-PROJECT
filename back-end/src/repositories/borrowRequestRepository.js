// repositories/BorrowRequestRepository.js
const BorrowRequest = require("../models/borrowRequest");

class BorrowRequestRepository {
  async createBorrowRequest(data) {
    return await BorrowRequest.create(data);
  }
  async getBorrowRequestByBorrowerAndBook(borrowerId, bookId) {
    return await BorrowRequest.findOne({ borrower: borrowerId, book: bookId });
  }
  async getAllBorrowRequestsReceived(lender) {
    return await BorrowRequest.find({ lender: lender })
      .populate({
        path: "borrower",
        select: "firstName lastName", // Specify the fields you want to populate from the genres collection
      })
      .populate("book");
  }

  async getAllBorrowRequestsSent(borrower) {
    return await BorrowRequest.find({ borrower: borrower })
      .populate({
        path: "lender",
        select: "firstName lastName", // Specify the fields you want to populate from the genres collection
      })
      .populate("book");
  }

  async updateBorrowRequest(id, data) {
    return await BorrowRequest.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBorrowRequest(id) {
    return await BorrowRequest.findByIdAndDelete(id);
  }
}

module.exports = new BorrowRequestRepository();
