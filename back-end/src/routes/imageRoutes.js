const express = require("express");
const router = express.Router();
const { upload, bucket,admin ,getCachedViewLink} = require('../../config/firebase');

// Set up Multer for file uploads
router.post('/upload', upload.single('image'), async (req, res) => {

  try {
    if (!req.file) {
        console.log("UPLOAD2")
        console.log('req.image', req.image)
        return res.status(400).json({ message: 'No file uploaded' });
    }
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


  // Define the API endpoint

router.get('/getviewlink/:imagePath', async (req, res) => {
    try {
        const imagePath = req.params.imagePath;
        const viewLink = await getCachedViewLink(imagePath);
        res.json({ viewLink });
        // console.log('cache', urlCache)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



  module.exports = router;