// server.js
const express = require("express");
const exphbs = require("express-handlebars");
const helpers = require("./handlebarsHelpers");
const { engine } = require("express-handlebars");
const path = require("path");
const routes = require("./routes");

const app = express();
const dotenv = require("dotenv");

// const productRoutes = require("./src/routes/productRoutes");
const connectToDatabase = require("../config/database");

dotenv.config();

const PORT = process.env.PORT || 3000;
process.env.TZ = "Asia/Ho_Chi_Minh";

const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Connect to MongoDB
connectToDatabase();

//cookies
var cookieParser = require("cookie-parser");

app.use(cookieParser());
//Template engine

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: helpers,
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
console.log(__dirname);
app.use(express.json());

// Routes

// app.use("/register", registerRoutes);
// app.use("/login", loginRoutes);

// app.use("/users", authMiddleware, userRoutes);
// app.use("/books", authMiddleware, bookRoutes);
// app.use("/borrow", authMiddleware, borrowRequestRoutes);
// app.use("/transactions", authMiddleware, transactionRoute);

// app.use("/genres", genreRoutes);
// app.use("/image",authMiddleware, imageRoutes);

// app.use("/", paymentRoutes);
// app.get("/thanhtoanthanhcong", (req, res) => {
//   res.json({ msg: "welcome" });
// });

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
