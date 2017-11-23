var express = require("express");
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");
var Furniture = require("../models/furniture");

router.get('/', (req, res) => {
  res.render('landing');
});

router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});

router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, avatar: req.body.avatar });
  if (req.body.adminCode === 'secretcode123') {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
      res.redirect("/furnitures");
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login', { page: 'login' });
});

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/furnitures',
    failureRedirect: '/login',

    failureFlash: 'Invalid username or password'
  }), (req, res) => {
  });

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/furnitures');
});

router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('/');
    }
    Furniture.find().where('author.id').equals(foundUser._id).exec((err, furnitures) => {
      if (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('/');
      }
      res.render('users/show', { user: foundUser, furnitures: furnitures });
    });
  });
});

module.exports = router;