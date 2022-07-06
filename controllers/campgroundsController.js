const Campground = require("../models/campgroundModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

module.exports.index = asyncErrorHandler(async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

module.exports.getNewCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.addNewCampground = asyncErrorHandler(async (req, res) => {
  req.body.campground.author = req.user._id;
  const camp = await Campground.create(req.body.campground);
  req.flash("success", "Campground created successfully!");
  res.redirect(`/campgrounds/${camp._id}`);
});

module.exports.getACampgroundById = asyncErrorHandler(async (req, res) => {
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
});

module.exports.getEditACampground = asyncErrorHandler(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("errors", "Cannot find that campground!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
});

module.exports.updateACampground = asyncErrorHandler(async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground
  );
  req.flash("success", "Campground updated successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteACampground = asyncErrorHandler(async (req, res) => {
  await Campground.findByIdAndRemove(req.params.id);
  req.flash("success", "Campground deleted successfully!");
  res.redirect("/campgrounds");
});
