"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global images */

(function () {

  var gallery = document.getElementById("gallery");
  var interval = 10000;
  var transition = 250;

  // Get the name of a random image from the list
  var getRandomImage = function getRandomImage() {
    var randomImage = images[Math.floor(Math.random() * images.length)];
    return gallery.src.includes(randomImage) ? getRandomImage() : randomImage;
  };

  // Set the src property of #gallery with the provided image's filename
  var setImage = function setImage(img) {
    gallery.src = "/img/gallery/" + img;
  };

  var wait = function wait(delay) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, delay);
    });
  };

  var advance = function () {
    var _ref = _asyncToGenerator(function* () {
      gallery.style.opacity = 0;
      yield wait(transition);
      setImage(getRandomImage());
      gallery.style.opacity = 0;
      yield wait(transition);
      gallery.style.opacity = 0.2;
    });

    return function advance() {
      return _ref.apply(this, arguments);
    };
  }();

  // Set the initial image randomly
  setImage(getRandomImage());

  // Change the image every interval
  setInterval(advance, interval);
})(); //# sourceMappingURL=/js/gallery.js.map