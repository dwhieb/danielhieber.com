'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global app, FormView, Model, View */

var ListView = function (_View) {
  _inherits(ListView, _View);

  /**
   * Create a new ListView
   * @param {Array} collection          The collection to use for the list
   * @param {String} type               The type of item displayed in this list
   */
  function ListView(collection, type) {
    _classCallCheck(this, ListView);

    var el = document.getElementById('overview');
    var template = document.getElementById('listItem-template');

    var _this = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this, el, template, collection));

    _this.sort();

    _this.nodes = {
      add: View.bind(document.getElementById('addButton')),
      list: View.bind(document.getElementById('list'))
    };

    _this.type = type || _this.collection[0].type;

    if (typeof _this.type !== 'string') {
      throw new Error('A "type" attribute is required, either as a parameter to ListView, or as an attribute on the data.');
    }

    return _this;
  }

  // adds a model to the collection (data only)


  _createClass(ListView, [{
    key: 'add',
    value: function add(model) {
      this.collection.add(model);
      return this.collection.length;
    }

    // destroys this view, removing all listeners

  }, {
    key: 'destroy',
    value: function destroy() {
      this.hide();
      this.removeListeners();
      this.nodes.list.innerHTML = '';
    }

    // looks up the model based on a click event in the list

  }, {
    key: 'lookupModel',
    value: function lookupModel(ev) {

      var target = ev.target;

      while (target.tagName !== 'LI') {
        target = target.parentNode;
      }

      var model = this.collection.find(function (model) {
        return Object.is(target.model, model);
      });
      return model || undefined;
    }

    // removes a model from the collection (data only)

  }, {
    key: 'remove',
    value: function remove(model) {
      this.collection.remove(model);
    }

    // confirms that the user wants to remove a model from the collection (data only)

  }, {
    key: 'removeConfirmed',
    value: function removeConfirmed(model) {
      var accepted = confirm('Are you sure you want to delete this item?');
      if (accepted) this.remove(model);
    }

    // renders the view, removing any existing listeners first

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.hide();
      this.removeListeners();
      this.nodes.list.innerHTML = '';
      this.sort();

      this.collection.forEach(function (model) {

        var listItem = _this2.template.content.cloneNode(true);
        var listItemText = model.title || model.organization || model.location || model.name || '(No Description)';

        listItem.querySelector('p').textContent = listItemText;
        listItem.querySelector('li').model = model;
        _this2.nodes.list.appendChild(listItem);
      });

      this.el.view = this;

      // add a single listener for event delegation
      this.el.addEventListener('click', function (ev) {

        var deadAreas = ['H1', 'OL', 'SECTION'];

        if (ev.target === _this2.nodes.add) {

          // if the Add button is clicked, add a model
          app.model = new Model({ type: _this2.type });
          _this2.collection.add(app.model);
          _this2.render();
          app.form = new FormView(app.model);
          app.form.render();
        } else if (!deadAreas.includes(ev.target.tagName)) {

          // otherwise lookup the model associated with the click event
          var model = _this2.lookupModel(ev);

          if (model) {

            if (ev.target.tagName === 'IMG') {
              // if Delete button was clicked, delete the model
              _this2.removeConfirmed(model);
              model.destroy();
              app.form.destroy();
              _this2.render();
            } else {
              // otherwise render the form view for that model
              app.model = model;
              app.form = new FormView(model);
              app.form.render();
            }
          } else {

            _this2.render(); // rerender if model was not found
          }
        }
      });

      this.display();
      this.nodes.add.display();
      return this;
    }

    // sorts the collection (data only)

  }, {
    key: 'sort',
    value: function sort() {
      this.collection.sort(function (a, b) {
        return a.name < b.name;
      });
      return this;
    }
  }]);

  return ListView;
}(View);