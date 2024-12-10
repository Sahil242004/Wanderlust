const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  console.log("you are on root");
  res.send("you are on root");
});

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
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
});

// new listing form route
app.get("/listings/new", (req, res) => {
  res.render("listings/newListingForm.ejs");
});

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  //   console.log(id);
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// create new listing form route
app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// edit form route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// edit route
app.put("/listings/:id", async (req, res) => {
  //   console.log("put req received");
  let { id } = req.params;
  let newListing = req.body.listing;
  await Listing.findByIdAndUpdate(id, newListing);
  res.redirect(`/listings/${id}`);
});

// delete listing
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let delListing = await Listing.findByIdAndDelete(id);
  console.log(delListing);
  res.redirect("/listings");
});

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
