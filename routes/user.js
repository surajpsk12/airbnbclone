const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// signup routes

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  WrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) {
                req.flash("error", err.message);
                return res.redirect("/signup");
            }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
     
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);


// login routes
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
  },
);

//logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out.");
    res.redirect("/listings");
  });
});

module.exports = router;
