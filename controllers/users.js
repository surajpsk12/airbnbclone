const User = require("../models/user");



module.exports.signup = async (req, res) => {
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
  };

module.exports.renderLoginForm =  (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
  };


module.exports.logout =  (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out.");
    res.redirect("/listings");
  });
};
