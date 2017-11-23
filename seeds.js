var mongoose = require("mongoose");
var Furniture = require("./models/furniture");
var Comment = require("./models/comment");

var data = [
  {
    name: "Cloud's Rest 1",
    image: "https://farm4.staticflickr.com/3433/3395240746_d9bae26a99.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.h"
  },
  {
    name: "Cloud's Rest 2",
    image: "https://farm4.staticflickr.com/3547/3423585461_f17f2dcf55.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    name: "Cloud's Rest 3",
    image: "https://farm4.staticflickr.com/3616/3395793750_207a6d4d36.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    name: "Cloud's Rest 4",
    image: "https://farm4.staticflickr.com/3657/3395588514_d176339062.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    name: "Cloud's Rest 5",
    image: "https://farm4.staticflickr.com/3625/3402031764_e7d6323fef.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }
]

function seedDB() {
  Furniture.remove({}, (err) => {
    if (err) {
      console.log(err)
    }
    data.forEach((seed) => {
      Furniture.create(seed, (err, furniture) => {
        if (err) {
          console.log(err);
        } else {
          Comment.create(
            {
              text: "Yellow Stone",
              author: "xxxy"
            }, (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                furniture.comments.push(comment);
                furniture.save();
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;