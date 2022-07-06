const { campgroundSchema, reviewSchema } = require("./schemas");
const ErrorHandler = require("./utils/ExpressError");
const asyncErrorHandler = require("./utils/asyncErrorHandler");
const Campground = require("./models/campgroundModel");
const Review = require("./models/reviewModel");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("errors", "You need to be logged in first!");
    return res.redirect("/login");
  }
  next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ErrorHandler(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ErrorHandler(msg, 400);
  } else {
    next();
  }
};

const isAuthor = asyncErrorHandler(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground || campground.author.toString() !== req.user._id.toString()) {
    req.flash("errors", "You don't have permission to do that!");
    return res.redirect("/campgrounds/" + req.params.id);
  }
  next();
});

const isReviewAuthor = asyncErrorHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.author.toString() !== req.user._id.toString()) {
    req.flash("errors", "You don't have permission to do that!");
    return res.redirect("/campgrounds/" + req.params.id);
  }
  next();
});

module.exports = {
  isLoggedIn,
  validateCampground,
  isAuthor,
  validateReview,
  isReviewAuthor,
};
