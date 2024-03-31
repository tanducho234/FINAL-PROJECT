// routes/borrowRequestRoutes.js

const express = require('express');
const router = express.Router();
const borrowRequestController = require('../controllers/borrowRequestController');

// Route for creating a new borrow request
router.post('/', borrowRequestController.createBorrowRequest);

//route for get all borrow request by lender
router.get('/', borrowRequestController.getAllBorrowRequestsByLender);

// Route for accepting a borrow request
router.put('/:id/accept', borrowRequestController.acceptBorrowRequest);

// Route for declining a borrow request
router.put('/:id/decline', borrowRequestController.declineBorrowRequest);

module.exports = router;
