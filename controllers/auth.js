const passport = require("passport");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const User = require("../models/user");

exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect("/books");
    }
    res.render("login", { title: "Login" });
};

exports.postLogin = (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: "Please enter a valid email." });
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: "Password cannot be blank." });
  
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/login");
    }
  
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("errors", info);
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash("success", "Success! You are logged in.");
        res.redirect("/books");
      });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout(() => {
      req.flash("success", "You have logged out.");
      res.redirect("/");
    });
};

exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect("/books");
    }
    res.render("signup", { title: "Signup" });
  };

  exports.postSignup = async (req, res) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: "Please enter a valid email." });
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: "Password must be at least 8 characters." });
  
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/signup");
    }
  
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        req.flash("errors", { msg: "Email is already registered." });
        return res.redirect("/signup");
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const studentId = uuidv4();
  
      user = await User.create({
        email: req.body.email,
        password: hashedPassword,
        studentId,
      });
  
      req.flash("success", `Signup successful! Your Student ID is: ${studentId}`);
      res.redirect("/login");
    } catch (err) {
      req.flash("errors", { msg: "Error registering user." });
      res.redirect("/signup");
    }
};