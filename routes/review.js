const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const customError = require("../utils/customError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");

// post review
router.post(
  "",
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log("inside route");
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log("Printing req body");
    // console.log(req.body);
    let newReview = new Review(req.body.review);
    // console.log(newReview);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// delete review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
