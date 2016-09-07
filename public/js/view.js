'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function view() {
  var View = function () {
    function View(el, data) {
      _classCallCheck(this, View);

      this.el = el;

      if (Array.isArray(data)) this.collection = data;else this.model = data;

      // TODO: return a Proxy that prevents overwriting certain properties, hides others, etc.
    }

    _createClass(View, [{
      key: 'display',
      value: function display() {}
    }, {
      key: 'hide',
      value: function hide() {}
    }]);

    return View;
  }();

  // export a Proxy for validating arguments when the View constructor is called


  modules.View = new Proxy(View, {
    construct: function construct(Target, args) {

      if (!(args[0] instanceof Node)) {
        throw new Error('The `el` argument must be an instance of a Node.');
      }

      if (!(args[1] instanceof Object)) {
        throw new Error('The `model` argument must be an Object.');
      }

      return new (Function.prototype.bind.apply(Target, [null].concat(_toConsumableArray(args))))();
    }
  });
})();