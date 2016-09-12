'use strict';

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

    // event listeners
    _this.el.addEventListener('click', function (ev) {

      if (ev.target === _this.nodes.addCategory) {

        var category = new Model({
          name: '{Category Name}',
          id: '{ID}',
          description: '{Category Description}'
        });

        _this.add(category);
        _this.sort();
        _this.render();
      }
    });

    return _this;
  }

  _createClass(CategoriesView, [{
    key: 'add',
    value: function add(category) {
      this.collection.add(category);
      return this.collection;
    }
  }, {
    key: 'remove',
    value: function remove(category) {

      var i = this.collection.findIndex(function (item) {
        return Object.is(item, category) || item.id === category;
      });

      if (i) {
        this.collection.splice(i, 1);
        return this.collection;
      }

      throw new Error('Could not find category.');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.nodes.list.innerHTML = '';

      this.collection.forEach(function (coll) {

        var li = document.createElement('li');

        var html = '\n        <p>' + coll.name + '</p>\n        <img src=/img/delete.svg alt=\'delete this category\'>\n      ';

        li.innerHTML = html;
        _this2.nodes.list.appendChild(li);
      });

      return this;
    }
  }, {
    key: 'sort',
    value: function sort() {
      this.collection.sort(function (a, b) {
        return a.name > b.name;
      });
      return this;
    }
  }]);

  return CategoriesView;
}(View);

var view = new CategoriesView([]);