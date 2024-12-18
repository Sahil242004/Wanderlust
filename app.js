const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const customError = require("./utils/customError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const sessionVariables = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

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

app.use(flash());
app.use(session(sessionVariables));
app.use((req, res, next) => {
  // console.log(req.flash("success"));
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);

// error middleware

app.all("*", (req, res, next) => {
  next(new customError(404, "page not found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occcured" } = err;
  // res.status(statusCode).send(message);
  // console.log(err);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
