var middleware = {};
var Furniture = require("../models/furniture");
var Comment = require("../models/comment");

middleware.checkFurnitureOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Furniture.findById(req.params.id, (err, foundFurniture) => {
      if (err || !foundFurniture) {
        req.flash('error', 'Furniture not found');
        res.redirect('back');
      } else {
        if (foundFurniture.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('back')
  }
}

middleware.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('back')
  }
}

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "You need to be logged in to do that");
  res.redirect('/login');
}

module.exports = middleware;