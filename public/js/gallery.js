/* eslint-env browser */
/* global socket */
(function runGallery() {

  let currentImage;
  const fallbackImage = 'cypress_trees.jpg';
  const gallery = document.getElementById('gallery');
  const images = [];
  const opacityTransition = 500;
  const transitionInterval = 10000;

  const changeImage = img => {
    gallery.src = `/img/gallery/${img}`;
  };

  const getRandomImage = () => {

    const randomImage = images[Math.floor(Math.random() * images.length)];

    if (randomImage === currentImage) {
      return getRandomImage();
    }

    currentImage = randomImage;

    return randomImage;

  };

  const toggleOpacity = () => {
    gallery.style.opacity = gallery.style.opacity === '0' ? '0.2' : '0';
  };

  const advance = () => {

    const img = getRandomImage();

    toggleOpacity();
    setTimeout(changeImage, opacityTransition/2, img);
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

}());
