const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

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

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
