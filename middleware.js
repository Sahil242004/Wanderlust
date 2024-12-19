const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema.js");
const customError = require("./utils/customError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.session.redirectUrl);
    req.flash("error", "You must be logged in first");
    return res.redirect("/LogIn");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log(req.session.redirectUrl);
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "sorry, you are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
  // console.log(req.body);
  // let resss = reviewSchema.validate(req.body);
  // console.log(resss);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log("error from validte listing function");
    let errMsg = error.details.map((el) => el.message).join(",");
    // console.log(errMsg);
    throw new customError(400, errMsg);
  } else {
    next();
  }
};
