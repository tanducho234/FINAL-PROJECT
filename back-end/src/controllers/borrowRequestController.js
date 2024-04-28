// controllers/borrowRequestController.js

const borrowRequestRepository = require("../repositories/borrowRequestRepository");
const userRepository = require("../repositories/userRepository");
const bookRepository = require("../repositories/bookRepository");
const { upload, bucket, getCachedViewLink } = require("../../config/firebase");

class BorrowRequestController {
  async getAllBorrowRequestsByUserId(req, res) {
    try {
      const borrowRequestsReceived =
        await borrowRequestRepository.getAllBorrowRequestsReceived(req.user.id);
      const borrowRequestsSent =
        await borrowRequestRepository.getAllBorrowRequestsSent(req.user.id);

      const updatedBorrowRequestsSent = await Promise.all(
        borrowRequestsSent.map(async (borrowRequestSent) => {
          // Call getCachedViewLink for lender's image path and await the result
          const lenderViewLink = await getCachedViewLink(
            borrowRequestSent.lender.imagePath
          );
          // Call getCachedViewLink for borrower's image path and await the result
          const borrowerViewLink = await getCachedViewLink(
            borrowRequestSent.borrower.imagePath
          );

          // Return a new object with the lenderViewLink and borrowerViewLink fields added
          return {
            ...borrowRequestSent.toObject(),
            lenderViewLink,
            borrowerViewLink,
          };
        })
      );
      const updatedBorrowRequestsReceived = await Promise.all(
        borrowRequestsReceived.map(async (borrowRequestReceived) => {
          // Call getCachedViewLink for lender's image path and await the result
          const lenderViewLink = await getCachedViewLink(
            borrowRequestReceived.lender.imagePath
          );
          // Call getCachedViewLink for borrower's image path and await the result
          const borrowerViewLink = await getCachedViewLink(
            borrowRequestReceived.borrower.imagePath
          );

          // Return a new object with the lenderViewLink and borrowerViewLink fields added
          return {
            ...borrowRequestReceived.toObject(),
            lenderViewLink,
            borrowerViewLink,
          };
        })
      );
      res.json({
        borrowRequestsReceived: updatedBorrowRequestsReceived,
        borrowRequestsSent: updatedBorrowRequestsSent,
        userId:req.user.id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async createBorrowRequest(req, res) {
    try {
      const { lenderId, bookId } = req.body;
      const borrowerId = req.user.id;

      // Check if borrower and lender exist
      const [borrower, lender] = await Promise.all([
        userRepository.getUserById(borrowerId),
        userRepository.getUserById(lenderId),
      ]);

      if (!borrower || !lender) {
        return res
          .status(404)
          .json({ message: "Borrower or lender not found" });
      }

      // Check if the borrower has already requested this book
      const existingRequest =
        await borrowRequestRepository.getBorrowRequestByBorrowerAndBook(
          borrowerId,
          bookId
        );
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "You have already sent a request for this book" });
      }
      const book = await bookRepository.getBookById(bookId);

      // Create the borrow request
      const borrowRequest = await borrowRequestRepository.createBorrowRequest({
        borrower: borrowerId,
        lender: lenderId,
        book: bookId,
        depositFee: book.depositFee,
        // returnDate: new Date(returnDate)
      });

      res.status(201).json({ borrowRequest });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async acceptBorrowRequest(req, res) {
    try {
      const currentBorrowRequest =
        await borrowRequestRepository.getBorrowRequestById(req.params.id);
      const currentBook = await bookRepository.getBookById(
        currentBorrowRequest.book
      );
      currentBook.status = "Unavailable";
      await bookRepository.updateBook(currentBook._id, currentBook);

      let statusToUpdate = currentBorrowRequest.status;
      if (statusToUpdate === "Accepted") {
        statusToUpdate = "In Delivering";
      } else if (statusToUpdate === "Pending") {
        statusToUpdate = "Accepted";
      }
      else if (statusToUpdate === "In Delivering") {
        statusToUpdate = "On Hold";
      }
      else if (statusToUpdate === "On Hold") {
        statusToUpdate = "In Returning";
      }
      else if (statusToUpdate === "In Returning") {
        statusToUpdate = "Returned";
        currentBook.status = "Available";
        await bookRepository.updateBook(currentBook._id, currentBook);
      }
      const borrowRequest = await borrowRequestRepository.updateBorrowRequest(
        req.params.id,
        { status: statusToUpdate, startDate: Date.now() }
      );

      if (!borrowRequest) {
        return res.status(404).json({ message: "Borrow request not found" });
      }

      res.json({ borrowRequest });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async rejectBorrowRequest(req, res) {
    try {
      const borrowRequest = await borrowRequestRepository.updateBorrowRequest(
        req.params.id,
        { status: "Rejected" }
      );

      if (!borrowRequest) {
        return res.status(404).json({ message: "Borrow request not found" });
      }

      res.json({ borrowRequest });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //delete
  async deleteBorrowRequest(req, res) {
    try {
      const borrowRequest = await borrowRequestRepository.deleteBorrowRequest(
        req.params.id
      );

      if (!borrowRequest) {
        return res.status(404).json({ message: "Borrow request not found" });
      }

      res.json({ message: "Borrow request deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new BorrowRequestController();
