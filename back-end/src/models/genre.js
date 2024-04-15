const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
