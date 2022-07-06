const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const {
  loginUser,
  registerUser,
  logoutUser,
  getLoginPage,
} = require("../controllers/userController");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", registerUser);

router.get("/login", getLoginPage);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  loginUser
);

router.get("/logout", logoutUser);

module.exports = router;
