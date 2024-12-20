const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("user/signUp.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    let newUser = new User({
      email,
      username,
    });

    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    // console.log(e);
    req.flash("error", "User already exists");
    res.redirect("/signUp");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("user/logIn.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wander Lust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You were logged out!");
    res.redirect("/listings");
  });
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You were logged out!");
    res.redirect("/listings");
  });
};
