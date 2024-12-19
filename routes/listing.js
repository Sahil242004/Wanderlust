const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const customError = require("../utils/customError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

validateListing = (req, res, next) => {
  // console.log(req.body);
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log("error from validte listing function");
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new customError(400, errMsg);
  } else {
    next();
  }
};

// index route
router.get(
  "",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

// new listing form route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/newListingForm.ejs");
});

// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    //   console.log(id);
    let listing = await Listing.findById(id).populate("review");
    if (!listing) {
      req.flash("error", "No Such Listing Exists!");
      res.redirect("/listings");
    } else {
      res.render("listings/show.ejs", { listing });
    }
  })
);

// create new listing form route
router.post(
  "",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //   throw new customError(400, "Send valid data for listing");
    // }

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "No Such Listing Exists!");
      res.redirect("/listings");
    } else {
      res.render("listings/edit.ejs", { listing });
    }
  })
);

// edit route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    //   console.log("put req received");
    // if (!req.body.listing) {
    //   throw new customError(400, "Send valid data for listing");
    // }
    let { id } = req.params;
    let newListing = req.body.listing;
    // console.log(newListing);
    await Listing.findByIdAndUpdate(id, newListing);
    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
  })
);

// delete listing
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
