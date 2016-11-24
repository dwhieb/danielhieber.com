'use strict';

/* global app, ListView, socket, View */

window.app = {

  nodes: {
    addButton: View.bind(document.getElementById('addButton')),
    buttons: View.bind(document.getElementById('buttons')),
    cvType: View.bind(document.getElementById('cv-type')),
    details: View.bind(document.getElementById('details')),
    formItems: View.bind(document.getElementById('formItems')),
    overview: View.bind(document.getElementById('overview'))
  },

  categories: [],
  collection: [],
  form: null,
  list: null,

  displayError: function displayError(err, message) {
    View.hide(this.nodes.buttons);
    this.nodes.formItems.innerHTML = '\n      <h1>' + message + '</h1>\n      <code>' + JSON.stringify(err, null, 2).replace(/\\/g, '') + '</code>\n    ';
  },
  refreshCategories: function refreshCategories() {
    var _this = this;

    socket.emit('getAll', 'category', function (err, res) {
      if (err) _this.displayError(err, 'Error retrieving categories');
      _this.categories = res;
    });
  },
  refreshList: function refreshList(type) {
    var _this2 = this;

    socket.emit('getAll', type, function (err, res) {
      _this2.nodes.details.hide();
      if (err) _this2.displayError(err, 'Error retrieving CV items.');
      if (_this2.list) _this2.list.destroy();
      _this2.list = new ListView(res, type);
      _this2.collection = _this2.list.collection;
      _this2.list.render();
    });
  }
};

app.nodes.addButton.hide();
app.nodes.details.hide();
app.refreshCategories();

// add event listeners
app.nodes.cvType.addEventListener('change', function (ev) {
  return app.refreshList(ev.target.value);
});
app.nodes.formItems.addEventListener('submit', function (ev) {
  return ev.preventDefault();
});