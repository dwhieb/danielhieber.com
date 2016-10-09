'use strict';

/* global FormView, ListView, socket, View */

// TODO: turn authentication back on for Admin subpages
// TODO: turn session middleware back on

(function app() {

  var categories = [];

  var nodes = {
    buttons: View.bind(document.getElementById('buttons')),
    cvType: View.bind(document.getElementById('cv-type')),
    details: View.bind(document.getElementById('details')),
    formItems: View.bind(document.getElementById('formItems')),
    overview: View.bind(document.getElementById('overview'))
  };

  var displayError = function displayError(err, message) {
    View.hide(nodes.buttons);
    nodes.formItems.innerHTML = '\n      <h1>' + message + '</h1>\n      <code>' + JSON.stringify(err, null, 2).replace(/\\/g, '') + '</code>\n    ';
  };

  nodes.cvType.addEventListener('change', function (ev) {

    socket.emit('getAll', ev.target.value, function (err, res) {
      if (err) return displayError(err, 'Error retrieving CV items.');
      var lv = new ListView(res);
      lv.render();
    });
  });

  socket.emit('getAll', 'category', function (err, res) {
    if (err) return displayError(err, 'Error retrieving categories.');
    categories = res;
  });
})();