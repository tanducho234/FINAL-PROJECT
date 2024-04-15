// routes/borrowRequestRoutes.js

const express = require('express');
const router = express.Router();
const borrowRequestController = require('../controllers/borrowRequestController');

// Route for creating a new borrow request
router.post('/', borrowRequestController.createBorrowRequest);

//route for get all borrow request by lender
router.get('/', borrowRequestController.getAllBorrowRequestsByLender);

// Route for accepting a borrow request
router.get('/accept/:id', borrowRequestController.acceptBorrowRequest);

// Route for declining a borrow request
router.get('/reject/:id', borrowRequestController.rejectBorrowRequest);
//delete
router.get('/delete/:id', borrowRequestController.deleteBorrowRequest);

module.exports = router;
