const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let initData = require("./data.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

const initDb = async () => {
  // clearing the previous data
  await Listing.deleteMany({});

  // inserting data
  await Listing.insertMany(initData.data);

  console.log("Data was initialized");
};

initDb();
