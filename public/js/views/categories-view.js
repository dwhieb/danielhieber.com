'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global Model, View */

var CategoriesView = function (_View) {
  _inherits(CategoriesView, _View);

  function CategoriesView(categories) {
    _classCallCheck(this, CategoriesView);

    var el = document.getElementById('overview');

    var _this = _possibleConstructorReturn(this, (CategoriesView.__proto__ || Object.getPrototypeOf(CategoriesView)).call(this, el, categories));

    _this.sort();

    _this.nodes = {
      list: View.bind(document.getElementById('categoriesList')),
      addCategory: View.bind(document.getElementById('addCategoryButton'))
    };

    // delegated event listener
    _this.el.addEventListener('click', function (ev) {
      if (ev.target.tagName !== 'OL' && ev.target.tagName !== 'SECTION') {

        if (ev.target === _this.nodes.addCategory) {

          var category = new Model({
            name: '{Category Name}',
            id: '{ID}',
            description: '{Category Description}'
          });

          _this.add(category);
          _this.sort();
          _this.render();
        } else {

          var target = ev.target;

          while (target.tagName !== 'LI') {
            target = target.parentNode;
          }

          var _category = _this.collection.find(function (category) {
            var symbols = Object.getOwnPropertySymbols(category);
            var match = symbols.some(function (symbol) {
              return category[symbol] === target;
            });
            if (match) return true;
            return false;
          });

          if (_category) {

            if (ev.tagName === 'IMG') {
              var accepted = confirm('Are you sure you want to delete this category?');
              if (accepted) {
                _this.remove(_category);
                _this.render();
              }
            } else {
              _this.emit('select', _category);
            }
          } else {

            throw new Error('Category could not be found.');
          }
        }
      }
    });

    return _this;
  }

  _createClass(CategoriesView, [{
    key: 'add',
    value: function add(category) {
      // TODO: category should be an instance of a Model
      this.collection.add(category);
      this.emit('add', category);
      return this.collection;
    }
  }, {
    key: 'remove',
    value: function remove(category) {
      var _this2 = this;

      var i = this.collection.findIndex(function (item) {
        return Object.is(item, category) || item.id === category;
      });

      if (i) {
        var _ret = function () {
          var category = _this2.collection.splice(i, 1);
          category.delete().then(function () {
            return _this2.emit('remove', category);
          });
          return {
            v: _this2.collection
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      throw new Error('Could not find category.');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      this.nodes.list.innerHTML = '';

      this.collection.forEach(function (category) {

        var li = document.createElement('li');

        var html = '\n        <p>' + category.name + '</p>\n        <img src=/img/delete.svg alt=\'delete this category\'>\n      ';

        li.innerHTML = html;
        _this3.nodes.list.appendChild(li);
        category[Symbol('element')] = li; // eslint-disable-line no-param-reassign
      });

      this.emit('render');

      return this;
    }
  }, {
    key: 'sort',
    value: function sort() {
      this.collection.sort(function (a, b) {
        return a.name > b.name;
      });
      this.emit('sort', this.collection);
      return this;
    }
  }]);

  return CategoriesView;
}(View);