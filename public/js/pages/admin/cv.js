'use strict';

/* global app, ListView, socket, View */

window.app = {

  nodes: {
    addButton: View.bind(document.getElementById('addButton')),
    buttons: View.bind(document.getElementById('buttons')),
    cvType: View.bind(document.getElementById('cv-type')),
    details: View.bind(document.getElementById('details')),
    form: View.bind(document.getElementById('form')),
    overview: View.bind(document.getElementById('overview'))
  },

  categories: [],
  collection: [],
  form: null,
  list: null,
  templates: document.querySelectorAll('#templates template'),

  displayError: function displayError(err, message) {
    View.hide(this.nodes.buttons);
    this.nodes.form.innerHTML = '\n      <h1>' + (message || err.message) + '</h1>\n      <code>' + JSON.stringify(err, null, 2).replace(/\\/g, '') + '</code>\n    ';
  },
  getTemplate: function getTemplate(prop) {
    return document.getElementById(prop + '-template');
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
      _this2.collection.sort(function (a, b) {
        return a.title > b.title;
      });
      _this2.list.render();
    });
  },
  removeModel: function removeModel(model) {
    var _this3 = this;

    model.destroy().then(function () {
      _this3.form.destroy();
      var i = _this3.collection.indexOf(model);
      if (i >= 0) _this3.collection.splice(i, 1);
      _this3.list.render();
    }).catch(function (err) {
      return _this3.displayError(err);
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
app.nodes.form.addEventListener('submit', function (ev) {
  return ev.preventDefault();
});