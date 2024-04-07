// server.js
const express = require("express");
const app = express();
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
// import multer from "multer";
// import config from "config/.config"


const mongoose = require("mongoose");
const dotenv = require("dotenv");

// const productRoutes = require("./src/routes/productRoutes");
const connectToDatabase = require("./config/database");
const userRoutes = require("./src/routes/userRoutes");
const bookRoutes = require("./src/routes/bookRoutes");
const loginRoutes=require("./src/routes/loginRoutes");
const genreRoutes = require("./src/routes/genreRoutes");
const registerRoutes = require("./src/routes/registerRoutes");
const imageRoutes = require("./src/routes/imageRoutes");
const borrowRequestRoutes = require("./src/routes/borrowRequestRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

dotenv.config();

const PORT = process.env.PORT || 3000;
process.env.TZ = 'Asia/Ho_Chi_Minh';

const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
const authMiddleware = require("./src/middlewares/authMiddleware");


// Connect to MongoDB
connectToDatabase();

// Routes

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.use("/users",authMiddleware, userRoutes);
app.use("/books",authMiddleware, bookRoutes);
app.use("/borrow",authMiddleware, borrowRequestRoutes);

app.use("/genres", genreRoutes);
app.use("/image",imageRoutes);

app.use('/',paymentRoutes)
app.get("/thanhtoanthanhcong", (req, res) => {
  res.json({msg: 'welcome'});
});
// const admin = require('firebase-admin');
// async function getViewLink(imagePath) {
//   try {
//     const bucket = admin.storage().bucket();
//     const file = bucket.file(imagePath);
//     // Get a signed URL for the file with a maximum validity of 1 hour
//     const signedUrl = await file.getSignedUrl({
//       action: 'read',
//       expires: Date.now() + 60 * 60 * 1000 // Link expiration time (1 hour)
//     });
//     return signedUrl[0];
//   } catch (error) {
//     console.error('Error getting view link:', error);
//     throw error;
//   }
// }

// // Define the API endpoint
// app.get('/getviewlink/:imagePath', async (req, res) => {
//   try {
//     const imagePath = req.params.imagePath;
//     const viewLink = await getViewLink(imagePath);
//     res.json({ viewLink });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
