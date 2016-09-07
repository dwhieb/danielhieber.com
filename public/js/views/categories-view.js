'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

  var Collection = modules.Collection;
  var View = modules.View;

  var CategoriesView = function (_View) {
    _inherits(CategoriesView, _View);

    function CategoriesView(el, categories) {
      _classCallCheck(this, CategoriesView);

      var _this = _possibleConstructorReturn(this, (CategoriesView.__proto__ || Object.getPrototypeOf(CategoriesView)).call(this, el, categories));

      _this.stopListening();
      _this.sort();

      _this.nodes = {
        addCategoryButton: _this.databind(_this.el.querySelector('button')),
        input: _this.databind(_this.el.querySelector('input')),
        list: _this.databind(document.getElementById('categoryList'))
      };

      var addNewCategory = function addNewCategory() {

        var category = {
          name: _this.nodes.input.value
        };

        _this.collection.add(category);
        _this.sort();
        app.categoriesView = new CategoriesView();

        // TODO: rerender categories view
        // TODO: render category view
      };

      // event listeners
      _this.nodes.input.addEventListener('change', addNewCategory);
      _this.nodes.addCategoryButton.addEventListener('click', addNewCategory);

      return _this;
    }

    _createClass(CategoriesView, [{
      key: 'addCategory',
      value: function addCategory() {}
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        this.collection.forEach(function (coll) {

          var li = document.createElement('li');

          var html = '\n          <p>' + coll.name + '</p>\n          <img src=/img/delete.svg alt=\'delete this category\'>\n        ';

          li.innerHTML = html;
          _this2.nodes.list.appendChild(li);
        });
      }
    }, {
      key: 'sort',
      value: function sort() {
        this.collection.sort(function (a, b) {
          return a.name > b.name;
        });
      }
    }]);

    return CategoriesView;
  }(View);

  modules.CategoriesView = new Proxy(CategoriesView, {
    construct: function construct(target, args) {

      if (!(args[0] instanceof Collection)) {
        throw new Error('The `data` argument must be an instance of a Collection.');
      }

      return Reflect.construct(target, args);
    }
  });
})();