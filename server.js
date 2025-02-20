const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require('passport')

require('dotenv').config({path: './config/.env'})

const app = express();

// Passport config
require("./config/passport")(passport);

// Middleware
app.set("view engine", "ejs"); // Set EJS as template engine
app.use(express.static("public")); // Serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
}) 