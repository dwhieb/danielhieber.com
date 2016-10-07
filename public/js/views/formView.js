'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global View */

var FormView = function (_View) {
  _inherits(FormView, _View);

  function FormView() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var type = arguments[1];

    _classCallCheck(this, FormView);

    var el = document.getElementById('formItems');

    var _this = _possibleConstructorReturn(this, (FormView.__proto__ || Object.getPrototypeOf(FormView)).call(this, el, null, data));

    if (typeof type === 'string' || typeof data.type === 'string') {
      _this.type = type || data.type;
    } else {
      throw new Error('Please include a "type" argument or attribute.');
    }

    return _this;
  }

  _createClass(FormView, [{
    key: 'render',
    value: function render() {
      // clear formItems
      // remove listeners from formItems
      // get properties for the given type from the whitelist hash
      // for each property:
      // - get its template
      // - populate its template
      // - append to formItems
      // - add listeners (if necessary)
      // add delegated event listener
      //
      // NB: create the properties to add and test them one at a time
    }
  }]);

  return FormView;
}(View);