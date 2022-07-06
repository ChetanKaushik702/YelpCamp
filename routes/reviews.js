const express = require("express");
const Campground = require("../models/campground");
const Review = require("../models/review");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ErrorHandler = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ErrorHandler(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  asyncErrorHandler(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await Review.create(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  asyncErrorHandler(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await Review.findByIdAndRemove(req.params.reviewId);
    campground.reviews.pull(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

module.exports = router;
