const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase.json");

const initialMessage = {
  content: "Welcome to the chat!",
  createdAt: new Date().getTime(), // Current timestamp
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://final-project-ad786.appspot.com", // Specify your Firebase Storage bucket name here
  });
  console.log("connected to FIREBASE-log");
  const firestore = admin.firestore();

  // const messageRef = firestore
  //   .collection("65e486d99ece6eb40a841e88")
  //   .doc("6608cd0af1115cd181755324")
  //   .collection("message");

  // messageRef.add(initialMessage);

  // const docRef = firestore
  //   .collection("65e486d99ece6eb40a841e88")
  //   .doc("6608cd0af1115cd181755324");

  //nguocc
  // const docRef = firestore
  //   .collection("6608cd0af1115cd181755324")
  //   .doc("65e486d99ece6eb40a841e88");

  // docRef.set(
  //   { latestMessage: "updated" },
  //   { merge: true }
  // )
} catch (err) {
  console.log(err);
}
const firestore = admin.firestore();

async function getMessages() {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(10);
  // messageRef.add(initialMessage);
  // const messages = await messageRef.get();

  console.log(query);
  return;
}
// Add the initial message to Firestore

// Initialize Firebase Storage
const bucket = admin.storage().bucket();
// const uuid = require('uuid');

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const urlCache = {}; // Simple cache object

async function getCachedViewLink(imagePath) {
  const now = Date.now();
  if (urlCache[imagePath] && urlCache[imagePath].expires > now) {
    // console.log(urlCache[imagePath].url)
    return urlCache[imagePath].url;
  } else {
    try {
      const signedUrl = await getViewLink(imagePath);
      urlCache[imagePath] = {
        url: signedUrl,
        expires: now + 60 * 60 * 10000, // Cache expiry time (1 hour)
      };
      return signedUrl;
    } catch (error) {
      console.error("Error getting cached view link:", error);
      throw error;
    }
  }
}

async function getViewLink(imagePath) {
  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(imagePath);
    // Get a signed URL for the file with a maximum validity of 1 hour
    const signedUrl = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 2400000, // Link expiration time (1 hour)
    });
    return signedUrl[0];
  } catch (error) {
    console.error("Error getting view link:", error);
    throw error;
  }
}

// console.log(getMessages());
module.exports = { upload, bucket, admin, getCachedViewLink, firestore };
