const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// signup routes
router.route("/signup")
  .get( (req, res) => {
    res.render("users/signup.ejs");
  })
  .post(
    wrapAsync(userController.signup)
  );


// login routes
router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);

//logout route
router.route("/logout")
  .get(userController.logout);

module.exports = router;
