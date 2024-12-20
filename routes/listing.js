const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const customError = require("../utils/customError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// index route and create new listing route
router
  .route("")
  .get(wrapAsync(listingController.index))
  // .post(validateListing, wrapAsync(listingController.makeNewListing));
  .post(upload.single("listing[image][url]"), (req, res) => {
    console.log("ost req for file received");
    console.log(req.file);
    res.send(req.file);
  });

// new listing form route
router.get("/new", isLoggedIn, listingController.renderNewListingForm);

// show route, edit route, delete route
router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

module.exports = router;
