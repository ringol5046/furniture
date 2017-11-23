var express = require("express");
var router = express.Router({ mergeParams: true });

var Furniture = require("../models/furniture");
var middleware = require("../middleware");
var Comment = require("../models/comment");

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Furniture.findById(req.params.id, (err, furniture) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { furniture: furniture })
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  Furniture.findById(req.params.id, (err, furniture) => {
    if (err) {
      console.log(err);
      res.redirect('/furnitures');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong")
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          furniture.comments.push(comment);
          furniture.save();
          req.flash("success", "Successfully added comment");
          res.redirect('/furnitures/' + furniture._id)
        }
      });
    }
  });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Furniture.findById(req.params.id, (err, foundFurniture) => {
    if (err || !foundFurniture) {
      req.flash('error', 'No Furniture found');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', { furniture_id: req.params.id, comment: foundComment });
      }
    });
  });
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', "Successfully update comment");
      res.redirect('/furnitures/' + req.params.id);
    }
  });
});

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', "Successfully delete comment");
      res.redirect('/furnitures/' + req.params.id);
    }
  })
});

module.exports = router;