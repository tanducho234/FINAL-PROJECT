const express = require("express");
const User = require("../models/user");
const Role = require("../models/role");
const Genre = require("../models/genre");
const mongoose = require("mongoose");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const Transaction = require("../models/transaction");
const BorrowRequest = require("../models/borrowRequest");
dotenv.config();
const secretKey = process.env.JWT_SECRET;

router.get("/", async (req, res) => {
  res.redirect("/admin/home");
});
router.get("/home", adminMiddleware, async (req, res) => {
  res.render("home", {
    authen: true,
  });
});
router.get("/login", async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { username, password } = req.body;

    console.log("aaa", username, password);
    const user = await User.findOne({ username }).populate("role");
    console.log(user);
    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      res.render("login", { errorMessage: "User not found" });
      return;
    }

    // Xác thực mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.render("login", { errorMessage: "Invalid password" });
      return;
    }
    if (user.role.roleName !== "Admin") {
      res.render("login", { errorMessage: "Access forbidden" });
      return;
    }
    // Tạo token JWT
    const token = jwt.sign(
      { userId: user._id, roleId: user.role.roleName },
      secretKey,
      { expiresIn: "5h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 5 * 3600 * 1000, // Set cookie expiration time to 1 hour (in milliseconds)
    });
    console.log("token", token);

    res.redirect("home");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/genre", adminMiddleware, async (req, res) => {
  const page = req.query.page || 1; // Default to page 1 if no page parameter is provided
  const perPage = 10; // Number of items per page

  const genresCount = await Genre.countDocuments();
  const totalPages = Math.ceil(genresCount / perPage);
  const startIndex = (page - 1) * perPage;

  const genres = (await Genre.find()
    .sort({ name: 1 })
    .skip(startIndex)
    .limit(perPage)
).map((genre) => genre.toObject());

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  res.render("genre", {
    genres,
    authen: true,
    activePage: "genre",
    currentPage: page,
    totalPages: totalPages,
    pages,
  });
});

router.post("/genre", adminMiddleware, async (req, res) => {
  const { name, description } = req.body;
  console.log("name", name);
  const genre = new Genre({ name, description });
  await genre.save();
  res.redirect("genre");
});

router.get("/genre/edit/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findById(id);
  res.render("genre-edit", {
    genre: genre.toObject(),
    authen: true,
    activePage: "genre",
  });
});
router.post("/genre/edit/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const genre = await Genre.findByIdAndUpdate(id, { name, description });
  res.redirect("/admin/genre");
});

//delete
router.post("/genre/delete/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    console.log(id);
    const deletedGenre = await Genre.deleteOne({ _id: id });
    if (!deletedGenre) {
      return res.status(404).send("Genre not found");
    }
    res.redirect("/admin/genre");
  } catch (error) {
    console.error("Error deleting genre:");
    res.status(500).send("Server error");
  }
});

//chart

router.get("/chart", async (req, res) => {
  try {
    // Query top-up transactions
    const topUpTransactions = await Transaction.find({ type: "Top-up" });
    // Sort transactions by transaction date
    topUpTransactions.sort((a, b) => a.transactionDate - b.transactionDate);
    // Group transactions by date and accumulate total amount for each day
    let accumulatedAmount = 0;
    const topUpGroupedData = topUpTransactions.reduce(
      (accumulator, transaction) => {
        const transactionDate = new Date(
          transaction.transactionDate
        ).toDateString();
        accumulatedAmount += transaction.amount;
        accumulator[transactionDate] = accumulatedAmount;
        return accumulator;
      },
      {}
    );

    // Query borrow requests
    const borrowRequests = await BorrowRequest.find({});
    const totalRequests = borrowRequests.length;
    const borrowRequestGroupedData = borrowRequests.reduce(
      (accumulator, request) => {
        if (!accumulator[request.status]) {
          accumulator[request.status] = 0;
        }
        accumulator[request.status]++;
        return accumulator;
      },
      {}
    );

    const completedRequests = borrowRequestGroupedData["Returned"] || 0;
    const incompleteRequests = totalRequests - completedRequests;

    const completedPercentage = (completedRequests / totalRequests) * 100;
    const incompletePercentage = (incompleteRequests / totalRequests) * 100;

    // Prepare data for the pie chart
    const borrowRequestData = [
      {
        label: "Completed",
        value: completedPercentage,
        count: completedRequests,
      },
      {
        label: "Incomplete",
        value: incompletePercentage,
        count: incompleteRequests,
      },
    ];

    // Convert grouped data to arrays for Chart.js
    const topUpLabels = Object.keys(topUpGroupedData);
    const topUpData = Object.values(topUpGroupedData);

    // Render the Handlebars template with Chart.js data
    console.log("topUpLabels", topUpLabels);
    console.log("topUpData", topUpData);
    console.log("borrowRequestData", borrowRequestData);

    res.render("charts", {
      topUpLabels,
      topUpData,
      borrowRequestData,
      authen: true,
      activePage: "chart",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/logout", (req, res) => {
  // Destroy the current session
  res.clearCookie("jwt");
  // Redirect the user to the desired page after logout
  res.redirect("login"); // Redirect to login page or any other page
});

module.exports = router;
