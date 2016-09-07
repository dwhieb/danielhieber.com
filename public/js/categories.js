'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global socket */

(function categories() {

  var View = modules.View;

  var app = {
    nodes: {
      categories: document.getElementById('categoryManagement'),
      details: document.getElementById('details')
    }
  };

  var CategoryView = function (_View) {
    _inherits(CategoryView, _View);

    function CategoryView(model) {
      _classCallCheck(this, CategoryView);

      var _this = _possibleConstructorReturn(this, (CategoryView.__proto__ || Object.getPrototypeOf(CategoryView)).call(this, app.nodes.details, model));

      _this.nodes = {
        name: _this.el.querySelector('h2'),
        description: _this.el.querySelector('p')
      };

      return _this;
    }

    _createClass(CategoryView, [{
      key: 'render',
      value: function render() {
        this.nodes.name.innerHTML = this.model.name;
        this.nodes.description.innerHTML = this.model.description;
      }
    }]);

    return CategoryView;
  }(View);

  var CategoriesView = function (_View2) {
    _inherits(CategoriesView, _View2);

    function CategoriesView(data) {
      _classCallCheck(this, CategoriesView);

      var categories = data.sort(function (a, b) {
        return a.name > b.name;
      });

      var _this2 = _possibleConstructorReturn(this, (CategoriesView.__proto__ || Object.getPrototypeOf(CategoriesView)).call(this, app.nodes.categories, categories));

      _this2.nodes = {
        list: document.getElementById('categoryList')
      };

      return _this2;
    }

    _createClass(CategoriesView, [{
      key: 'render',
      value: function render() {
        var _this3 = this;

        this.collection.forEach(function (coll) {

          var li = document.createElement('li');

          var html = '\n          <p>' + coll.name + '</p>\n          <img src=/img/delete.svg alt=\'delete this category\'>\n        ';

          li.innerHTML = html;
          _this3.nodes.list.appendChild(li);
        });
      }
    }]);

    return CategoriesView;
  }(View);

  socket.emit('getCategories', function (err, categories) {

    err = {
      status: 500,
      details: 'bad stuff'
    };

    if (err) {

      app.currentCategory = {
        name: 'Error',
        description: '\n          Unable to retrieve categories:\n          <br>\n          ' + JSON.stringify(err, null, 2) + '\n        '
      };

      app.categoryView = new CategoryView(app.currentCategory);
      app.categoryView.render();
      app.categoryView.display();
    } else {

      app.categories = categories;
      app.categoriesView = new CategoriesView(app.categories);
      app.categoriesView.render();
    }
  });
})();