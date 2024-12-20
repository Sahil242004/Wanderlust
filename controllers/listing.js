const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewListingForm = (req, res) => {
  res.render("listings/newListingForm.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  //   console.log(id);
  let listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "No Such Listing Exists!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.makeNewListing = async (req, res, next) => {
  // if (!req.body.listing) {
  //   throw new customError(400, "Send valid data for listing");
  // }

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "No Such Listing Exists!");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { listing });
  }
};

module.exports.editListing = async (req, res) => {
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
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let delListing = await Listing.findByIdAndDelete(id);
  console.log(delListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
