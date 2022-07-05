const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Joi = require("joi");
const Campground = require("./models/campground");
const asyncErrorHandler = require("./utils/asyncErrorHandler");
const ErrorHandler = require("./utils/ExpressError");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  asyncErrorHandler(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  asyncErrorHandler(async (req, res) => {
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
      }).required(),
    });

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ErrorHandler(msg, 400);
    }

    const camp = await Campground.create(req.body.campground);
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  asyncErrorHandler(async (req, res) => {
    await Campground.findByIdAndRemove(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  err.message = err.message || "Oops! Something went wrong.";
  res.status(statusCode).render("error", { err });
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
