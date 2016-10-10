// Loads a Socket for use on every page
const socket = io({
  transports: ['websocket', 'xhr-polling'],
});

const debounce = (func, wait, immediate) => {

  let timeout;

  return (...args) => {

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);

  };

};
