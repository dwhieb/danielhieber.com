'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.listeners = {};
  }

  _createClass(Emitter, [{
    key: 'emit',
    value: function emit(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!(eventName in this.listeners)) throw new Error('"' + eventName + '" event does not exist.');

      this.listeners[eventName].forEach(function (cb) {
        return cb.apply(undefined, args);
      });
    }
  }, {
    key: 'on',
    value: function on(eventName, cb) {
      if (typeof eventName !== 'string') throw new Error('Event name must be a string.');
      if (typeof cb !== 'function') throw new Error('Callback must be a function.');

      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(cb);
    }
  }, {
    key: 'once',
    value: function once(eventName, cb) {
      var _this = this;

      if (typeof cb !== 'function') throw new Error('Callback must be a function.');

      var proxyHandler = function proxyHandler() {
        cb.apply(undefined, arguments); // eslint-disable-line callback-return
        _this.removeListener(eventName, proxyHandler);
      };

      this.on(eventName, proxyHandler);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(eventName, listener) {
      if (!(eventName in this.listeners)) throw new Error('No listener for "' + eventName + '" exists.');
      if (typeof listener !== 'function') throw new Error('`listener` must be a function.');

      var i = this.listeners[eventName].findIndex(function (el) {
        return Object.is(listener, el);
      });

      if (i) {
        this.listeners[eventName].splice(i, 1);
        if (this.listeners[eventName].length === 0) delete this.listeners[eventName];
      } else {
        throw new Error('Listener not found.');
      }
    }
  }, {
    key: 'removeListeners',
    value: function removeListeners(eventName) {
      if (eventName) {
        if (typeof eventName !== 'string') throw new Error('Event name must be a string.');
        delete this.listeners[eventName];
      } else {
        this.listeners = {};
      }
    }
  }], [{
    key: 'extend',
    value: function extend(obj) {

      var target = obj.prototype || obj;
      var source = this.prototype;

      Object.assign(target, new Emitter());

      Object.getOwnPropertyNames(source).forEach(function (prop) {
        if (prop !== 'constructor') {
          var propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop);
          Object.defineProperty(target, prop, propertyDescriptor);
        }
      });

      return target;
    }
  }]);

  return Emitter;
}();