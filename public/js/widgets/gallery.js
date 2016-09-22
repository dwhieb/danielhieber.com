(() => {

  const gallery = document.getElementById('gallery'); // the gallery element

  if (gallery) {
    var currentImage; // the currently active image
    const fallbackImage = 'cypress_trees.jpg'; // image to use if socket fails
    const images = []; // list of images from the /gallery folder
    const opacityTransition = 500; // transition timing from main.less
    const transitionInterval = 10000; // interval between image changes

    /**
     * Changes the src attribute of the gallery element
     * @param  {String} img The filename of the image
     * @return {undefined} No return
     */
    const changeImage = img => {
      gallery.src = `/img/gallery/${ img }`;
      currentImage = img;
    };

    /**
     * Gets a random image from the images list.
     * Runs recursively until the new image is different from the previous.
     * @return {String} randomImage   The filename of the image.
     */
    const getRandomImage = () => {

      const randomImage = images[Math.floor(Math.random() * images.length)];

      if (randomImage === currentImage) {
        return getRandomImage();
      }

      return randomImage;
    };

    /**
     * Toggles the opacity of the gallery element between 0.2 and 0.0.
     * @return {undefined} No return
     */
    const toggleOpacity = () => {
      gallery.style.opacity = gallery.style.opacity === '0' ? '0.2' : '0';
    };

    /**
     * Changes the gallery image to the next random image
     * @return {undefined} No return
     */
    const advance = () => {

      const img = getRandomImage();

      toggleOpacity();
      setTimeout(changeImage, opacityTransition / 2, img);
      setTimeout(toggleOpacity, opacityTransition);
    };

    if (socket) {
      socket.on('gallery', imageList => {
        images.push(...imageList);
        changeImage(getRandomImage());
        setInterval(advance, transitionInterval);
      });
    } else {
      changeImage(fallbackImage);
    }
  }
})();