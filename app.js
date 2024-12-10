const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

app.get("/", (req, res) => {
  console.log("you are on root");
  res.send("you are on root");
});

app.get("/testListing", async (req, res) => {
  let trialListing = new Listing({
    title: "Sahil's house",
    description: "Hello World",
    price: 20000,
    location: "Hadapsar",
    country: "India",
  });
  await trialListing.save();
  console.log("trial listing was saved");
  res.send("successfull testing");
});

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
