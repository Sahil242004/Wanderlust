const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const customError = require("./utils/customError.js");
const schema = require("./schema.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  console.log("you are on root");
  res.send("you are on root");
});

validateListing = (req, res, next) => {
  let { error } = schema.validate(req.body);
  if (error) {
    console.log("error from validte listing function");
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new customError(400, errMsg);
  } else {
    next();
  }
};

// app.get("/testListing", async (req, res) => {
//   let trialListing = new Listing({
//     title: "Sahil's house",
//     description: "Hello World",
//     price: 20000,
//     location: "Hadapsar",
//     country: "India",
//   });
//   await trialListing.save();
//   console.log("trial listing was saved");
//   res.send("successfull testing");
// });

// index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

// new listing form route
app.get("/listings/new", (req, res) => {
  res.render("listings/newListingForm.ejs");
});

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    //   console.log(id);
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

// create new listing form route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //   throw new customError(400, "Send valid data for listing");
    // }

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// edit form route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// edit route
app.put(
  "/listings/:id",
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
    res.redirect(`/listings/${id}`);
  })
);

// delete listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
  })
);

// error middleware

app.all("*", (req, res, next) => {
  next(new customError(404, "page not found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occcured" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
