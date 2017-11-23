var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var furnitureRoutes = require("./routes/furnitures");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/index")

var User = require("./models/user")
var Furniture = require("./models/furniture");
var Comment = require("./models/comment");

var seedDB = require("./seeds");

var app = express();

const port = process.env.PORT;

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v11");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash());
app.set('view engine', 'ejs');

//===========================
// passport setup
//===========================

app.use(require("express-session")({
  secret: 'Esperanza gomesz',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.locals.moment = require('moment');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(authRoutes);
app.use('/furnitures/:id/comments', commentRoutes);
app.use('/furnitures', furnitureRoutes);

app.listen(3000, () => {
  console.log(`Server start on ${port}`);
});