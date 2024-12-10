const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}

app.get("/", (req, res) => {
  console.log("you are on root");
  res.send("ypu are on root");
});

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
