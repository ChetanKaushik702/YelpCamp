const express = require("express");
const {
  index,
  getNewCampground,
  addNewCampground,
  getACampgroundById,
  getEditACampground,
  updateACampground,
  deleteACampground,
} = require("../controllers/campgroundsController");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const router = express.Router();

router.get("/", index);

router.get("/new", isLoggedIn, getNewCampground);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  addNewCampground
);

router.get("/:id", getACampgroundById);

router.get("/:id/edit", isLoggedIn, getEditACampground);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateCampground,
  updateACampground
);

router.delete("/:id", isLoggedIn, isAuthor, deleteACampground);

module.exports = router;
