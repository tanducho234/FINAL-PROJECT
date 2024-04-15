const Transaction = require("../models/transaction");

class TransactionRepository {
  async createTransaction(data) {
    return await Transaction.create(data);
  }

  async getAllTransactions() {
    return await Transaction.find();
  }
  async getTransactionByUserId(id) {
    return await Transaction.find({ userId: id });
  }
  // Add other repository methods as needed
}

module.exports = new TransactionRepository();
