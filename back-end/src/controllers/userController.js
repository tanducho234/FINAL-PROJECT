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

      if (await userRepository.getUserByUsername(username)) {
        console.log('Username already exists');
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // Generate an email verification token
      const verificationToken = jwt.sign({ username }, secretKey, { expiresIn: '1d' });

      //getBaseUrl
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`
      const mailOptions = {
        from: GMAIL_USERNAME, // Replace with your email address
        to: email,
        subject: 'Email Verification',
        html: `<p>Hello ${username},</p>
               <p>Click the following link to verify your email:</p>
               <a href="${baseUrl}/register/verify/${verificationToken}">Verify Email</a>`
      };

      const role = await Role.findOne({ roleName: 'User' });
      console.log(role);
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
      res.status(201).json({ message: "User registered successfully. Check your email for verification instructions." });
      try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
      }
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
        return res.status(401).json({ message: "Wrong password or username" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Wrong password or username" });
      }
      // Check if the user's email is verified
      if (!user.emailVerified) {
        return res.status(401).json({ message: "Email not verified. Please verify your email to log in." });
      }
      const token = jwt.sign(
        { id: user._id, username: user.username },
        secretKey,
        { expiresIn: "7d" }
      );
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: "Unable to log in" });
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
      const updatedUser = await userRepository.updateUserEmailVerificationStatus(decoded.username, true);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid or expired token" });
    }
  }

  async profile(req, res) {
    try {
      const userName = req.user.username
      console.log('async profile(req, res)', req.user);
      const userInfor = await userRepository.getUserByUsername(userName)
      // console.log(userInfor);
      res.status(200).json(userInfor);
    } catch (err) {
      res.status(500).json({ message: "profile not found" });
    }

  }

  async updateProfile(req, res) {
    const userName = req.user.username
    const { firstname, lastname, bio, address, imagePath } = req.body; // Assuming these are the fields to be updated
    try {
      const user = await userRepository.getUserByUsername(userName)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (bio) user.bio = bio;
      if (address) user.address = address;
      if (firstname) user.firstName = firstname;
      if (lastname) user.lastName = lastname;
      if (imagePath) user.imagePath = imagePath;
      // Save the updated user object
      await user.save();
      // Return the updated user object
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Unable to update profile' });
    }
  }
  //get account balance
  async getAccountBalance(req, res) {
    const userName = req.user.username
    console.log('getAccountBalance', req.user);
    try {
      const user = await userRepository.getUserByUsername(userName)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Return the account balance
      res.json({
        message: 'Account balance', accountBalance: user.accountBalance, userId: user.id,
        fullName: user.firstName + ' ' + user.lastName
      });
    } catch (error) {
      console.error('Error getting account balance:', error);
      res.status(500).json({ error: 'Unable to get account balance' });
    }
  }

  async updateAccountBalance(req, res) {
    const userName = req.user.username
    const { amount } = req.body; // Assuming this is the new account balance
    try {
      const user = await userRepository.getUserByUsername(userName)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.accountBalance += amount;
      // Save the updated user object
      await user.save();
      // Return the updated user object
      res.json({ message: 'Account balance updated successfully', user });
    } catch (error) {
      console.error('Error updating account balance:', error);
      res.status(500).json({ error: 'Unable to update account balance' });
    }
  }
}
module.exports = new UserController();