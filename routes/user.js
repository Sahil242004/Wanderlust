const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");

router.get("/signUp", (req, res) => {
  res.render("user/signUp.ejs");
});

router.post(
  "/signUp",
  wrapAsync(async (req, res) => {
    try {
      let { username, password, email } = req.body;
      let newUser = new User({
        email,
        username,
      });

      let registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", "User already exists");
      res.redirect("/signUp");
    }
  })
);

module.exports = router;
