const transactionRepository = require("../repositories/transactionRepository");

class TransactionController {
  async createTransaction(req, res) {
    try {
      const transaction = await transactionRepository.createTransaction(
        req.body
      );
      res.status(201).json(transaction);
    } catch (error) {
      console.error("transactionController", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const transactions = await transactionRepository.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getTransactionById(req, res) {
    try {
      const transactions = await transactionRepository.getTransactionByUserId(
        req.user.id
      );
      if (!transactions) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Add other controller methods as needed
}

module.exports = new TransactionController();
