'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global View */

/**
 * Events emitted by ListView
 */

var ListView = function (_View) {
  _inherits(ListView, _View);

  function ListView(collection, listedProperty) {
    _classCallCheck(this, ListView);

    var el = document.getElementById('overview');
    var template = document.getElementById('listItemTemplate');

    var _this = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this, el, template, collection));

    if (typeof listedProperty === 'string') {
      _this.listedProperty = listedProperty;
    } else {
      throw new TypeError('The "listedProperty" argument must be a string.');
    }

    _this.sort();

    _this.nodes = {
      list: View.bind(document.getElementById('list')),
      add: View.bind(document.getElementById('addButton'))
    };

    // helper function
    var lookupModel = function lookupModel(ev) {

      var target = ev.target;

      while (target.tagName !== 'LI') {
        target = target.parentNode;
      }

      var model = _this.collection.find(function (model) {
        var symbols = Object.getOwnPropertySymbols(model);
        var match = symbols.some(function (symbol) {
          return model[symbol] === target;
        });
        if (match) return true;
        return false;
      });

      return model || undefined;
    };

    // add a single listener for event delegation
    _this.el.addEventListener('click', function (ev) {

      if (ev.target.tagName !== 'OL' && ev.target.tagName !== 'SECTION') {

        if (ev.target === _this.nodes.add) {

          // if the Add button is clicked, add a model
          _this.emit('new');
        } else {

          // otherwise lookup the model associated with the click event
          var model = lookupModel(ev);

          // model was found
          if (model) {

            if (ev.target.tagName === 'IMG') {
              // if Delete button was clicked, delete the model
              _this.removeConfirmed(model);
            } else {
              // otherwise emit a 'select' event
              _this.emit('select', model);
            }

            // rerender if model was not found
          } else {

            console.error('Model could not be found.');
            _this.render();
          }
        }
      }
    });

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

      this.nodes.list.innerHTML = '';
      this.sort();

      this.collection.forEach(function (model) {

        var listItem = _this2.template.content.cloneNode(true);
        listItem.querySelector('p').textContent = model[_this2.listedProperty];
        _this2.nodes.list.appendChild(listItem);
        model[Symbol('element')] = listItem; // eslint-disable-line no-param-reassign
      });

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