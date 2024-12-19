const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");

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

router.get("/logIn", (req, res) => {
  res.render("user/logIn.ejs");
});

router.post(
  "/logIn",
  passport.authenticate("local", {
    failureRedirect: "/logIn",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back to Wander Lust!");
    res.redirect("/listings");
  })
);

router.get("/LogOut", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You were logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
