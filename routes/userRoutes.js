const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post(
  "/register",
  asyncErrorHandler(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to YelpCamp " + registeredUser.username);
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("errors", e.message);
      res.redirect("/register");
    }
  })
);

module.exports = router;
