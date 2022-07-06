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

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const router = express.Router();

router.get("/", index);

router.get("/new", isLoggedIn, getNewCampground);

router.post("/", isLoggedIn, validateCampground, addNewCampground);

router.get("/:id", getACampgroundById);

router.get("/:id/edit", isLoggedIn, getEditACampground);

router.put("/:id", isLoggedIn, isAuthor, validateCampground, updateACampground);

router.delete("/:id", isLoggedIn, isAuthor, deleteACampground);

module.exports = router;
