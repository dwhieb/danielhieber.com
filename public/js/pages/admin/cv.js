'use strict';

/* global ListView, socket, View */

window.app = function cv() {

  var app = {};
  var list = void 0;

  var nodes = {
    addButton: View.bind(document.getElementById('addButton')),
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

  nodes.addButton.hide();
  nodes.details.hide();

  nodes.cvType.addEventListener('change', function (ev) {

    socket.emit('getAll', ev.target.value, function (err, res) {
      if (err) return displayError(err, 'Error retrieving CV items.');
      nodes.details.hide();
      if (list) list.destroy();
      list = new ListView(res, ev.target.value);
      list.on('new', nodes.details.display);
      list.render();
    });
  });

  nodes.details.addEventListener('submit', function (ev) {
    return ev.preventDefault();
  });

  socket.emit('getAll', 'category', function (err, res) {
    if (err) return displayError(err, 'Error retrieving categories.');
    app.categories = res;
  });

  return app;
}();