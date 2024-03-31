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


const urlCache = {}; // Simple cache object

async function getCachedViewLink(imagePath) {
    const now = Date.now();
    if (urlCache[imagePath] && urlCache[imagePath].expires > now) {
        console.log('cache')
        return urlCache[imagePath].url;
    } else {
        try {
            const signedUrl = await getViewLink(imagePath);
            urlCache[imagePath] = {
                url: signedUrl,
                expires: now + 60 * 60 * 1000 // Cache expiry time (1 hour)
            };
            return signedUrl;
        } catch (error) {
            console.error('Error getting cached view link:', error);
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
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000 // Link expiration time (1 hour)
        });
        return signedUrl[0];
    } catch (error) {
        console.error('Error getting view link:', error);
        throw error;
    }
}


module.exports = {upload,bucket,admin,getCachedViewLink}

