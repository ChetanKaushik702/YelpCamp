const express = require("express");
const passport = require("passport");
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
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to YelpCamp " + registeredUser.username);
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("errors", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back " + req.user.username);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get(
  "/logout",
  asyncErrorHandler(async (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "Logged out successfully");
      res.redirect("/campgrounds");
    });
  })
);

module.exports = router;
