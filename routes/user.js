const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signUp", userController.signupForm);

router.post("/signUp", wrapAsync(userController.signup));

router.get("/logIn", userController.loginForm);

router.post(
  "/logIn",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/logIn",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
);

router.get("/LogOut", userController.logout);

module.exports = router;
