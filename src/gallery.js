/* global images */

(() => {

  const gallery    = document.getElementById(`gallery`);
  const interval   = 5000;
  const transition = 250;

  // Get the name of a random image from the list
  const getRandomImage = () => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return gallery.src.includes(randomImage) ? getRandomImage() : randomImage;
  };

  // Set the src property of #gallery with the provided image's filename
  const setImage = img => {
    gallery.src = `/img/gallery/${img}`;
  };

  const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

  const advance = async () => {
    gallery.style.opacity = 0;
    await wait(transition);
    setImage(getRandomImage());
    gallery.style.opacity = 0;
    await wait(transition);
    gallery.style.opacity = 0.2;
  };

  // Set the initial image randomly
  setImage(getRandomImage());

  // Change the image every interval
  setInterval(advance, interval);

})();
