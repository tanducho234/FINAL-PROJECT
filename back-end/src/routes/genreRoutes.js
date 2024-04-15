const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");

// Create a new genre
router.get("/", genreController.getAllGenres);
module.exports = router;
