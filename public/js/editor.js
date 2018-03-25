"use strict";

/* eslint-env browser */

var dropdown = document.getElementById("dropdown");

var updateType = function updateType(ev) {
  window.location = "/admin/" + ev.target.value;
};

dropdown.onchange = updateType; //# sourceMappingURL=/js/editor.js.map