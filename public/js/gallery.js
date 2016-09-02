'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-env browser */
/* global socket */
(function runGallery() {

  var gallery = document.getElementById('gallery'); // the gallery element

  if (gallery) {
    var currentImage;

    (function () {
      // the currently active image
      var fallbackImage = 'cypress_trees.jpg'; // image to use if socket fails
      var images = []; // list of images from the /gallery folder
      var opacityTransition = 500; // transition timing from main.less
      var transitionInterval = 10000; // interval between image changes

      /**
       * Changes the src attribute of the gallery element
       * @param  {String} img The filename of the image
       * @return {undefined} No return
       */
      var changeImage = function changeImage(img) {
        gallery.src = '/img/gallery/' + img;
        currentImage = img;
      };

      /**
       * Gets a random image from the images list.
       * Runs recursively until the new image is different from the previous.
       * @return {String} randomImage   The filename of the image.
       */
      var getRandomImage = function getRandomImage() {

        var randomImage = images[Math.floor(Math.random() * images.length)];

        if (randomImage === currentImage) {
          return getRandomImage();
        }

        return randomImage;
      };

      /**
       * Toggles the opacity of the gallery element between 0.2 and 0.0.
       * @return {undefined} No return
       */
      var toggleOpacity = function toggleOpacity() {
        gallery.style.opacity = gallery.style.opacity === '0' ? '0.2' : '0';
      };

      /**
       * Changes the gallery image to the next random image
       * @return {undefined} No return
       */
      var advance = function advance() {

        var img = getRandomImage();

        toggleOpacity();
        setTimeout(changeImage, opacityTransition / 2, img);
        setTimeout(toggleOpacity, opacityTransition);
      };

      if (socket) {
        socket.on('gallery', function (imageList) {
          images.push.apply(images, _toConsumableArray(imageList));
          changeImage(getRandomImage());
          setInterval(advance, transitionInterval);
        });
      } else {
        changeImage(fallbackImage);
      }
    })();
  }
})();