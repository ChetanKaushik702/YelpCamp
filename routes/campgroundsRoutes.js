const express = require("express");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Campground = require("../models/campgroundModel");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const router = express.Router();

router.get(
  "/",
  asyncErrorHandler(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  asyncErrorHandler(async (req, res) => {
    req.body.campground.author = req.user._id;
    const camp = await Campground.create(req.body.campground);
    req.flash("success", "Campground created successfully!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get(
  "/:id",
  asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("errors", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
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
  isLoggedIn,
  isAuthor,
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
  isLoggedIn,
  isAuthor,
  asyncErrorHandler(async (req, res) => {
    await Campground.findByIdAndRemove(req.params.id);
    req.flash("success", "Campground deleted successfully!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
