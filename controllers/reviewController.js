const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

module.exports.addAReview = asyncErrorHandler(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  req.body.review.author = req.user._id;
  const review = await Review.create(req.body.review);
  campground.reviews.push(review);
  await campground.save();
  req.flash("success", "Review created successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteAReview = asyncErrorHandler(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = await Review.findByIdAndRemove(req.params.reviewId);
  campground.reviews.pull(review);
  await campground.save();
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
});
