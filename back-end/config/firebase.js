const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');
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
const bucket = admin.storage().bucket();
// const uuid = require('uuid'); 


// Set up Multer for file uploads
const storage= multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = {upload,bucket}

