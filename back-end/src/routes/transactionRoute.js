const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/", transactionController.createTransaction);
// router.get('/', transactionController.getAllTransactions);
router.get("/", transactionController.getTransactionById);

// Add other routes as needed

module.exports = router;
