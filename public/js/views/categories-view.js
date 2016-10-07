'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global Category, View */

/**
 * Events emitted by CategoriesView
 * @event CategoriesView#add
 * @event CategoriesView#new
 * @event CategoriesView#remove
 * @event CategoriesView#render
 * @event CategoriesView#select
 * @event CategoriesView#sort
 */

/**
 * A class representing the Categories View
 * @type {Object} CategoriesView
 */
var CategoriesView = function (_View) {
  _inherits(CategoriesView, _View);

  /**
   * Create a new CategoriesView
   * @class
   * @param {Array} categories        The array of Category models for the view. Can be an Array or a Collection.
   */
  function CategoriesView(categories) {
    _classCallCheck(this, CategoriesView);

    var el = document.getElementById('overview');

    var _this = _possibleConstructorReturn(this, (CategoriesView.__proto__ || Object.getPrototypeOf(CategoriesView)).call(this, el, categories));

    _this.sort();

    _this.nodes = {
      list: View.bind(document.getElementById('categoriesList')),
      addCategory: View.bind(document.getElementById('addCategoryButton'))
    };

    // Delete the given category from the collection, and rerender view
    var deleteCategory = function deleteCategory(category) {
      var accepted = confirm('Are you sure you want to delete this category?');
      if (accepted) _this.remove(category);
    };

    // Given a click event, lookup the associated category
    var getCategory = function getCategory(ev) {

      var target = ev.target;

      while (target.tagName !== 'LI') {
        target = target.parentNode;
      }

      var category = _this.collection.find(function (category) {
        var symbols = Object.getOwnPropertySymbols(category);
        var match = symbols.some(function (symbol) {
          return category[symbol] === target;
        });
        if (match) return true;
        return false;
      });

      return category || undefined;
    };

    // add a single listener for event delegation
    _this.el.addEventListener('click', function (ev) {
      if (ev.target.tagName !== 'OL' && ev.target.tagName !== 'SECTION') {

        // if the Add Category button is clicked, add a category
        if (ev.target === _this.nodes.addCategory) {
          _this.emit('new');

          // otherwise lookup the category associated with the click event
        } else {

          var category = getCategory(ev);

          // category was found
          if (category) {

            if (ev.target.tagName === 'IMG') {
              // if Delete button was clicked, delete the category
              deleteCategory(category);
            } else {
              // otherwise emit a 'select' event
              _this.emit('select', category);
            }

            // rerender if category was not found
          } else {

            console.error('Category could not be found.');
            _this.render();
          }
        }
      }
    });

    return _this;
  }

  _createClass(CategoriesView, [{
    key: 'add',
    value: function add(category) {

      if (!(category instanceof Category)) {
        throw new Error('Category must be an instance of Category.');
      }

      this.collection.add(category);
      this.emit('add', category);
      return this.collection;
    }
  }, {
    key: 'remove',
    value: function remove(category) {
      this.collection.remove(category);
      this.emit('remove', category);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.nodes.list.innerHTML = '';

      this.sort();

      this.collection.forEach(function (category) {

        var li = document.createElement('li');

        var html = '\n        <p>' + category.name + '</p>\n        <img src=/img/delete.svg alt=\'delete this category\'>\n      ';

        li.innerHTML = html;
        _this2.nodes.list.appendChild(li);
        category[Symbol('element')] = li; // eslint-disable-line no-param-reassign
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

  return CategoriesView;
}(View);