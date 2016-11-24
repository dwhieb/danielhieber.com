'use strict';

// Loads a Socket for use on every page
var socket = io({
  transports: ['websocket', 'xhr-polling']
});

var debounce = function debounce(func, wait, immediate) {
  var _this = this;

  var timeout = void 0;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(_this, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(_this, args);
  };
};