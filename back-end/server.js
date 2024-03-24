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
dotenv.config();

const PORT = process.env.PORT || 3000;
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
app.use("/genres", genreRoutes);

app.get("/", (req, res) => {
  res.json({msg: 'welcome'});
});


const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('../back-end/config/firebase.json');
try{
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://final-project-ad786.appspot.com" // Specify your Firebase Storage bucket name here

});
console.log('connected to FIREBASE')
}catch(err){
  console.log(err)
}

// Initialize Firebase Storage
// const storage = getStorage();
const storage= multer.memoryStorage();
const bucket = admin.storage().bucket();
const uuid = require('uuid'); 


// Set up Multer for file uploads
const upload = multer({ storage: storage });
app.post('/upload', upload.single('image'), async (req, res) => {
  console.log("UPLOAD file",req.file)
  const { title, author, genre, ISBN } = req.body
  console.log(title, author, genre, ISBN)
  try {
    if (!req.file) {
      console.log("UPLOAD2")
      console.log('req.image',req.image)
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log("UPLOAD3")

    const bucket = admin.storage().bucket();
    const fileName = Date.now() + req.file.originalname;
    const file = bucket.file(fileName);

    // Upload the file to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });

    // Get the image path
    const imagePath = `${fileName}`;

    return res.json({ imagePath });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

async function getViewLink(imagePath) {
  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(imagePath);

    // Get a signed URL for the file with a maximum validity of 1 hour
    const signedUrl = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000 // Link expiration time (1 hour)
    });

    return signedUrl[0];
  } catch (error) {
    console.error('Error getting view link:', error);
    throw error;
  }
}

// Define the API endpoint
app.get('/getviewlink/:imagePath', async (req, res) => {
  try {
    const imagePath = req.params.imagePath;
    const viewLink = await getViewLink(imagePath);
    res.json({ viewLink });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
