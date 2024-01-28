// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const dotenv = require("dotenv");
const Role = require("../models/role");
const nodemailer = require('nodemailer');

dotenv.config();
const secretKey = process.env.JWT_SECRET;
const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

class UserController {


  async registerUser(req, res) {
    try {

      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      // Generate an email verification token
      const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '1d' });

      //getBaseUrl
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`
      const mailOptions = {
        from: GMAIL_USERNAME, // Replace with your email address
        to: email,
        subject: 'Email Verification',
        html: `<p>Click the following link to verify your email:</p><a href="${baseUrl}/users/verify/${verificationToken}">Verify Email</a>`,
      };

      const role = await Role.findOne({ roleName: 'User' });
      const user = await userRepository.createUser({
        username,
        password: hashedPassword,
        email,
        role,
        verificationToken,
      });
      // Send the verification email 
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Replace with your SMTP server hostname or IP address
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: GMAIL_USERNAME, // Replace with your email address
          pass: GMAIL_PASSWORD, // Replace with your email password
        },
      });

      try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
      }
      res.status(201).json({ message: "User registered successfully. Check your email for verification instructions." });
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
      // Check if the user's email is verified
      if (!user.emailVerified) {
        return res.status(401).json({ error: "Email not verified. Please verify your email to log in." });
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
  async verify(req, res) {
    const { token } = req.params;

    try {
      // Verify the token
      const decoded = jwt.verify(token, secretKey);
      // const user = await userRepository.findOne({ email: decoded.email });
      // Update user's verification status in the database
      console.log(decoded);
      const updatedUser = await userRepository.updateUserEmailVerification(decoded.email, true);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid or expired token" });
    }
  }


}
module.exports = new UserController();