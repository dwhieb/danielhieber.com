'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CategoryView = function (_View) {
  _inherits(CategoryView, _View);

  function CategoryView(model) {
    _classCallCheck(this, CategoryView);

    var el = document.getElementById('details');

    var _this = _possibleConstructorReturn(this, (CategoryView.__proto__ || Object.getPrototypeOf(CategoryView)).call(this, el, model));

    _this.nodes = {
      name: document.getElementById('name'),
      id: document.getElementById('id'),
      description: document.getElementById('description'),
      saveButton: document.getElementById('saveButton'),
      deleteButton: document.getElementById('deleteButton')
    };

    // event listeners
    _this.el.addEventListener('change', function (ev) {
      if (ev.target.id in _this.nodes) {
        _this.model.update(_defineProperty({}, ev.target.id, ev.target.value));
      }
    });

    _this.nodes.saveButton.addEventListener('click', _this.model.save);

    _this.nodes.deleteButton.addEventListener('click', function () {
      _this.model.delete();
      _this.remove();
    });

    return _this;
  }

  _createClass(CategoryView, [{
    key: 'remove',
    value: function remove() {
      this.stopListening();
      this.hide();
    }
  }, {
    key: 'render',
    value: function render() {
      this.nodes.description.value = this.model.description;
      this.nodes.id.value = this.model.id;
      this.nodes.name.value = this.model.name;
      this.display();
      return this;
    }
  }]);

  return CategoryView;
}(View);

var view = new CategoryView({}).render();