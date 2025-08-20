const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("", (req, res) => res.redirect("/listings"));

router
  .route("/signUp")
  .get(userController.signupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/logIn")
  .get(userController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/logIn",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

router.get("/LogOut", userController.logout);

module.exports = router;
