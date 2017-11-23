var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchame = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: String,
  isAdmin: { type: Boolean, default: false }
});

userSchame.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchame);