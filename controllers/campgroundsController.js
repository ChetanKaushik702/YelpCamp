const Campground = require("../models/campgroundModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = asyncErrorHandler(async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

module.exports.getNewCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.addNewCampground = asyncErrorHandler(async (req, res) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  req.body.campground.geometry = geoData.body.features[0].geometry;
  req.body.campground.author = req.user._id;
  req.body.campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
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
    .populate("author")
    .populate("images");
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
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Campground updated successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteACampground = asyncErrorHandler(async (req, res) => {
  await Campground.findByIdAndRemove(req.params.id);
  req.flash("success", "Campground deleted successfully!");
  res.redirect("/campgrounds");
});
