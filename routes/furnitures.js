var express = require("express");
var multer = require('multer');
var router = express.Router();

var middleware = require("../middleware");
var Furniture = require("../models/furniture");

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dcccvfapf', 
  api_key: 959621427946467, 
  api_secret: 'wP6VpAZMiw0cQ8AnOFVhFBmWLCY'
});

router.get("/", function (req, res) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Furniture.find({name: regex}, (err, foundFurniture) => {
      if(err) {
        console.log(err);
      } else {
        res.render("furnitures/index", { furnitures: foundFurniture});
      }
    })
  } else {
    Furniture.find({}, function (err, allFurnitures) {
      if (err) {
        console.log(err);
      } else {
        res.render("furnitures/index", { furnitures: allFurnitures, page: 'furnitures'});
      }
    });
  }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (result) => {
    req.body.furniture.image = result.secure_url;
    req.body.furniture.author = {
      id: req.user._id,
      username: req.user.username
    }
    Furniture.create(req.body.furniture, (err, furniture) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/furnitures/' + furniture.id);
    });
  });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('furnitures/new');
});

router.get('/:id', (req, res) => {
  Furniture.findById(req.params.id).populate('comments').exec((err, foundFurniture) => {
    if (err || !foundFurniture) {
      req.flash('error', "Furniture not found");
      return res.redirect('back');
    } else {
      res.render('furnitures/show', { furniture: foundFurniture });
    }
  });
});

router.get('/:id/edit', middleware.checkFurnitureOwnership, (req, res) => {
  Furniture.findById(req.params.id, (err, foundFurniture) => {
    res.render('furnitures/edit', { furniture: foundFurniture });
  });
});

router.put('/:id', middleware.checkFurnitureOwnership, (req, res) => {
  Furniture.findByIdAndUpdate(req.params.id, req.body.furniture, (err, updatedFurniture) => {
    if (err) {
      res.redirect('/furnitures');
    } else {
      req.flash('success', "Successfully update furniture");
      res.redirect('/furnitures/' + req.params.id);
    }
  });
});

router.delete('/:id', middleware.checkFurnitureOwnership, (req, res) => {
  Furniture.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/furnitures');
    } else {
      req.flash('success', "Successfully delete furniture");
      res.redirect('/furnitures');
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = router;