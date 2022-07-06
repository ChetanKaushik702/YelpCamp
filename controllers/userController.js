const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

module.exports.registerUser = asyncErrorHandler(async (req, res, next) => {
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
});

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back " + req.user.username);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/campgrounds");
  });
});

module.exports.getLoginPage = (req, res) => {
  res.render("users/login");
};
