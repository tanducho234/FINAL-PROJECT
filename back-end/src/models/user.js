// models/users.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  address: String,
  imagePath: String,
  bio: String,
  registrationDate: { type: Date, default: Date.now },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  accountBalance: { type: Number, default: 0 },
  favoriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
