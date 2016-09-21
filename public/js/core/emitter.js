'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** A class representing an Event Emitter */
var Emitter = function () {
  /**
   * Create a new Emitter instance
   * @class
   * @prop {Object} listeners         An object containing all the listeners for each event type
   */
  function Emitter() {
    _classCallCheck(this, Emitter);

    Object.defineProperty(this, 'listeners', {
      value: {}
    });
  }

  /**
   * Calls the callback functions registered for the given event name
   * @method
   * @param {String} eventName    The event name to fire
   * @param {Any}    [args]       The remaining arguments to pass to the event callback
   */


  _createClass(Emitter, [{
    key: 'emit',
    value: function emit(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (eventName in this.listeners) {
        this.listeners[eventName].forEach(function (cb) {
          return cb.apply(undefined, args);
        });
      }
    }

    /**
     * Removes listeners from the object. If no arguments are provided, all listeners are removed. If only an eventName is provided, all listeners are removed for that event name. If only a listener is provided, that listener is removed from all events. If both an event name and listener are provided, only that particular listener for that particular event is removed.
     * @method
     * @param {String} [eventName]       The event to remove listeners for.
     * @param {Function} [listener]      The listener to remove.
     */

  }, {
    key: 'off',
    value: function off(eventName, listener) {
      var _this = this;

      if (eventName && typeof eventName !== 'string' && typeof eventName !== 'function') {
        throw new Error('The .off() method should be passed an event name (String), listener (Function), both, or neither.');
      }

      var event = typeof eventName === 'string' ? eventName : undefined;
      var cb = typeof eventName === 'function' ? eventName : listener;

      if (event && !(event in this.listeners)) {
        throw new Error('No listeners for "' + eventName + '" exist.');
      }

      var removeListener = function removeListener(evName, listenerFunc) {

        var i = _this.listeners[evName].findIndex(function (func) {
          return Object.is(func, listenerFunc);
        });

        // this requires explicit comparison b/c the index may sometimes be zero
        if (i >= 0) {
          _this.listeners[evName].splice(i, 1);
          if (_this.listeners[evName].length === 0) delete _this.listeners[evName];
          return true;
        }

        return false;
      };

      if (event && cb) {

        removeListener(event, cb);
      } else if (cb) {

        for (var evName in this.listeners) {
          removeListener(evName, cb);
        }
      } else if (event) {

        delete this.listeners[event];
      } else {

        for (var prop in this.listeners) {
          delete this.listeners[prop];
        }
      }
    }

    /**
     * Attaches a listener for the given event name
     * @method
     * @param {String} eventName      The name of the event to attach the listener to
     * @param {Function} cb           The callback function (the listener) to fire each time the event is triggered
     */

  }, {
    key: 'on',
    value: function on(eventName, cb) {
      if (typeof eventName !== 'string') throw new Error('Event name must be a string.');
      if (typeof cb !== 'function') throw new Error('Callback must be a function.');

      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(cb);
    }

    /**
     * Attach a listener to an event that will only fire the first time the event occurs
     * @method
     * @param {String} eventName      The name of the event to attach the listener to
     * @param {Function} cb           The callback function (the listener) to fire when the event is triggered. This callback will only fire once.
     */

  }, {
    key: 'once',
    value: function once(eventName, cb) {
      var _this2 = this;

      if (typeof cb !== 'function') throw new Error('Callback must be a function.');

      var proxyHandler = function proxyHandler() {
        _this2.off(eventName, proxyHandler);
        cb.apply(undefined, arguments);
      };

      this.on(eventName, proxyHandler);
    }

    /**
     * Extends
     * @static
     * @function
     * @param {Object} obj        The object to extend the Event Emitter methods to
     * @return {Object} obj       Returns the original object, with the Event Emitter methods attached
     */

  }], [{
    key: 'extend',
    value: function extend() {
      var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


      var target = obj.prototype || obj;
      var source = this.prototype;

      var assign = function assign(tgt, src) {
        return Object.getOwnPropertyNames(src).forEach(function (prop) {
          if (prop !== 'constructor') {
            var propertyDescriptor = Object.getOwnPropertyDescriptor(src, prop);
            Object.defineProperty(tgt, prop, propertyDescriptor);
          }
        });
      };

      assign(target, source);
      assign(target, new Emitter());

      return target;
    }
  }]);

  return Emitter;
}();