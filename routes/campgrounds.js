const express = require("express");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Campground = require("../models/campground");
const ErrorHandler = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas");

const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ErrorHandler(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  asyncErrorHandler(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  asyncErrorHandler(async (req, res) => {
    const camp = await Campground.create(req.body.campground);
    req.flash("success", "Campground created successfully!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get(
  "/:id",
  asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("errors", "Cannot find that campground!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("errors", "Cannot find that campground!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    req.flash("success", "Campground updated successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  asyncErrorHandler(async (req, res) => {
    await Campground.findByIdAndRemove(req.params.id);
    req.flash("success", "Campground deleted successfully!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
