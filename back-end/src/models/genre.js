const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

genreSchema.pre("deleteOne", async function (next) {
  console.log("remove", this.getFilter()._id);
  const genreId =  this.getFilter()._id;
  try {
    // Update all books that reference this genre
    await mongoose.model("Book").updateMany(
      { genres: genreId },
      { $pull: { genres: genreId } },
      { multi: true } // To update multiple documents
    );
    next();
  } catch (error) {
    next(error);
  }
});
const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
