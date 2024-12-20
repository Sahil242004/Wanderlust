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

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6765b0aa78aba49678c3392e",
  }));

  // inserting data
  await Listing.insertMany(initData.data);

  console.log("Data was initialized");
};

initDb();
