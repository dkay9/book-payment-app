const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require('../models/user')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "studentId" }, async (studentId, password, done) => {
      try {
        const user = await User.findOne({ studentId });
        if (!user) return done(null, false, { message: "Student ID not registered" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
