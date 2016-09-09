'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var View = function () {
    function View(el, data) {
      _classCallCheck(this, View);

      this.el = this.databind(el);
      this.nodes = {};

      if (Array.isArray(data)) this.collection = data;else this.model = data;

      // TODO: return a Proxy that prevents overwriting certain properties, hides others, etc.
    }

    _createClass(View, [{
      key: 'databind',
      value: function databind(el) {

        // TODO: if this never needs to refer to `this`, decouple it from View

        el.addEventListener = new Proxy(el.addEventListener, {
          apply: function apply(target, context, args) {

            var handler = args[1];

            el.listeners = el.listeners || [];

            el.listeners.push({
              type: args[0],
              handler: args[1],
              opts: args[2]
            });

            return Reflect.apply(target, context, args);
          }
        });

        return el;
      }
    }, {
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

        var removeListeners = function removeListeners(el) {
          el.listeners.forEach(function (listener) {
            el.removeEventListener(listener.type, listener.handler, listener.opts);
          });
        };

        removeListeners(this.el);

        for (var el in this.nodes) {
          removeListeners(this.nodes[el]);
        }
      }
    }]);

    return View;
  }();

  // export a Proxy for validating arguments when the View constructor is called


  modules.View = new Proxy(View, {
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
})();