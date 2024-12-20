const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const customError = require("../utils/customError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// index route
router.get("", wrapAsync(listingController.index));

// new listing form route
router.get("/new", isLoggedIn, listingController.renderNewListingForm);

// show route
router.get("/:id", wrapAsync(listingController.show));

// create new listing form route
router.post("", validateListing, wrapAsync(listingController.makeNewListing));

// edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

// edit route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.editListing)
);

// delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
