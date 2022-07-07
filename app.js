if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ErrorHandler = require("./utils/ExpressError");
const campgroundsRoutes = require("./routes/campgroundsRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const userRoutes = require("./routes/userRoutes");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("./models/userModel");
const multer = require("multer");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

const sessionConfig = {
  name: "session",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(flash());
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.errors = req.flash("errors");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/camps/:id/reviews", reviewsRoutes);

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  err.message = err.message || "Oops! Something went wrong.";
  res.status(statusCode).render("error", { err });
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
