'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NB: listeners should be removed BEFORE the new CategoryView is instantiated

var CategoryView = function (_View) {
  _inherits(CategoryView, _View);

  function CategoryView(model) {
    _classCallCheck(this, CategoryView);

    var el = document.getElementById('details');

    var _this = _possibleConstructorReturn(this, (CategoryView.__proto__ || Object.getPrototypeOf(CategoryView)).call(this, el, model));

    _this.nodes = {};

    return _this;
  }

  _createClass(CategoryView, [{
    key: 'remove',
    value: function remove() {
      this.removeListeners();
      this.hide();
    }
  }, {
    key: 'render',
    value: function render() {
      this.nodes.description.innerHTML = this.model.description;
      this.nodes.id.innerHTML = this.model.id;
      this.nodes.name.innerHTML = this.model.name;
      this.display();
    }
  }]);

  return CategoryView;
}(View);