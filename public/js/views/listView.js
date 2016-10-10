'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global FormView, Model, View */

/**
 * Events emitted by ListView
 */

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

  _createClass(ListView, [{
    key: 'add',
    value: function add(model) {
      this.collection.add(model);
      this.emit('add', model);
      return this.collection.length;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.hide();
      this.nodes.list.innerHTML = '';
      this.removeListeners();
    }

    // helper function

  }, {
    key: 'lookupModel',
    value: function lookupModel(ev) {

      var target = ev.target;

      while (target.tagName !== 'LI') {
        target = target.parentNode;
      }

      var model = this.collection.find(function (model) {
        var symbols = Object.getOwnPropertySymbols(model);
        var match = symbols.some(function (symbol) {
          return model[symbol] === target;
        });
        if (match) return true;
        return false;
      });

      return model || undefined;
    }
  }, {
    key: 'remove',
    value: function remove(model) {
      this.collection.remove(model);
      this.emit('remove', model);
    }
  }, {
    key: 'removeConfirmed',
    value: function removeConfirmed(model) {
      var accepted = confirm('Are you sure you want to delete this item?');
      if (accepted) this.remove(model);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.hide();
      this.nodes.list.innerHTML = '';
      this.sort();

      this.collection.forEach(function (model) {

        var listItem = _this2.template.content.cloneNode(true);

        var listItemText = model.title || model.organization || model.location || model.name || '(No Description)';

        listItem.querySelector('p').textContent = listItemText;
        _this2.nodes.list.appendChild(listItem);
        model[Symbol('element')] = listItem; // eslint-disable-line no-param-reassign
        listItem.model = model;
      });

      this.el.view = this;

      // add a single listener for event delegation
      this.el.addEventListener('click', function (ev) {

        var deadAreas = ['H1', 'OL', 'SECTION'];

        if (ev.target === _this2.nodes.add) {

          // if the Add button is clicked, add a model
          var waitTime = 5000;
          var debouncedUpdate = debounce(function () {
            return _this2.render();
          }, waitTime);
          var model = new Model({ type: _this2.type });
          var fv = new FormView(model);

          _this2.collection.add(model);
          _this2.removeListeners();
          _this2.render();
          fv.render();
          model.on('update', debouncedUpdate);
          _this2.emit('new');
        } else if (!deadAreas.includes(ev.target.tagName)) {

          // otherwise lookup the model associated with the click event
          var _model = _this2.lookupModel(ev);

          // model was found
          if (_model) {

            if (ev.target.tagName === 'IMG') {
              // if Delete button was clicked, delete the model
              _this2.removeConfirmed(_model);
            } else {
              // otherwise emit a 'select' event
              _this2.emit('select', _model);
            }

            // rerender if model was not found
          } else {

            console.error('Model could not be found.');
            _this2.render();
          }
        }
      });

      this.display();
      this.nodes.add.display();
      this.emit('render');
      return this;
    }
  }, {
    key: 'sort',
    value: function sort() {
      this.collection.sort(function (a, b) {
        return a.name < b.name;
      });
      this.emit('sort', this.collection);
      return this;
    }
  }]);

  return ListView;
}(View);