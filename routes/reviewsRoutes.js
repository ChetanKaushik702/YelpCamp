const express = require("express");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const {
  addAReview,
  deleteAReview,
} = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, addAReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, deleteAReview);

module.exports = router;
