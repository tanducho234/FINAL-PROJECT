// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const dotenv = require("dotenv");
const Role = require("../models/role");

dotenv.config();
const secretKey = process.env.JWT_SECRET;

class UserController {
  async registerUser(req, res) {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = await Role.findOne({ roleName: 'User' });
      const user = await userRepository.createUser({
        username,
        password: hashedPassword,
        email,
        role,
      });
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to register user" });
    }
  }

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userRepository.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        secretKey,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Unable to log in" });
    }
  }

  // /verify
  async verifyUser(req, res) {
    try {
    } catch (err) {
      res.status(500).json({ error: "Unable to log in" });
    }
  }

}

module.exports = new UserController();