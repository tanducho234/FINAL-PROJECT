// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.JWT_SECRET;

function adminMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt;
    console.log("token", token);
    // Check if token exists
    if (!token) {
      res.redirect("/admin/login");
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);

    // If token is valid, attach decoded user data to request object for further use
    req.user = decoded;

    // Redirect user to home page
    next();
  } catch (error) {
    console.log("aaaaa", error);
    // If token is invalid, clear cookie and proceed to next middleware
    try {
      res.clearCookie("jwt");
      res.redirect("/admin/login");
    } catch (error) {
      console.log("aaaaa");
    }
  }
}

module.exports = adminMiddleware;
