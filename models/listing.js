const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/adandoned-old-house-with-boarded-up-windows_33099-2585.jpg?t=st=1733809628~exp=1733813228~hmac=a11e3b9db091af548dacddc1476b31734ec531400babfbe54a7814223528ef0b&w=1380",
    set: (v) =>
      v === ""
        ? "https://img.freepik.com/free-vector/adandoned-old-house-with-boarded-up-windows_33099-2585.jpg?t=st=1733809628~exp=1733813228~hmac=a11e3b9db091af548dacddc1476b31734ec531400babfbe54a7814223528ef0b&w=1380"
        : v,
  },
  price: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
