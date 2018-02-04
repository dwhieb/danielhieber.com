"use strict";

var dropdown = document.getElementById("dropdown");
dropdown.onchange = function (ev) {
  window.location = "/admin/" + ev.target.value;
}; //# sourceMappingURL=/js/editor.js.map