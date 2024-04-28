// index.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const userRoutes = require('./userRoutes');
const bookRoutes = require('./bookRoutes');
const loginRoutes = require('./loginRoutes');
const genreRoutes = require('./genreRoutes');
const registerRoutes = require('./registerRoutes');
const imageRoutes = require('./imageRoutes');
const borrowRequestRoutes = require('./borrowRequestRoutes');
const paymentRoutes = require('./paymentRoutes');
const transactionRoute = require('./transactionRoute');
const adminRoutes = require('./adminRoutes');
// Add routes to the router
router.use('/register', registerRoutes);
router.use('/login', loginRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/books', authMiddleware, bookRoutes);
router.use('/borrow', authMiddleware, borrowRequestRoutes);
router.use('/transactions', authMiddleware, transactionRoute);
router.use('/genres', genreRoutes);
router.use('/image', authMiddleware, imageRoutes);
router.use('/', paymentRoutes);
router.use('/admin', adminRoutes);


module.exports = router;
