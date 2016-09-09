'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = new Proxy(function () {
  function View(el, data) {
    _classCallCheck(this, View);

    this.el = View.bind(el);
    this.nodes = {};

    if (Array.isArray(data)) this.collection = data;else this.model = data;
  }

  _createClass(View, [{
    key: 'display',
    value: function display(displayStyle) {
      this.el.style.display = displayStyle || 'flex';
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.style.display = 'none';
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.stopListening();
      this.el.remove();
    }
  }, {
    key: 'stopListening',
    value: function stopListening() {

      if (this.el.listeners) {

        var removeListeners = function removeListeners(el) {
          el.listeners.forEach(function (listener) {
            var type = listener.type;
            var handler = listener.handler;
            var opts = listener.opts;

            el.removeEventListener(type, handler, opts);
          });
        };

        removeListeners(this.el);

        for (var el in this.nodes) {
          removeListeners(this.nodes[el]);
        }
      } else {
        return;
      }
    }
  }], [{
    key: 'bind',
    value: function bind(el) {

      el.listeners = el.listeners || [];

      var registerListener = function registerListener() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var type = args[0];
        var eventHandler = args[1];
        var opts = args[2];


        el.listeners.push({
          type: type,
          eventHandler: eventHandler,
          opts: opts
        });

        return el.addEventListener.apply(el, args);
      };

      var proxyHandler = {
        get: function get(target, prop, receiver) {
          if (prop === 'addEventListener') return registerListener;
          return Reflect.get(target, prop, receiver);
        }
      };

      return new Proxy(el, proxyHandler);
    }
  }]);

  return View;
}(), {
  construct: function construct(target, args) {

    if (!(args[0] instanceof Node)) {
      throw new Error('The `el` argument must be an instance of a Node.');
    }

    if (!(args[1] instanceof Object)) {
      throw new Error('The `model` argument must be an Object.');
    }

    return Reflect.construct(target, args);
  }
});