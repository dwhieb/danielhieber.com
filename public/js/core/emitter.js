'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emitter = function () {

  var assign = function assign(target, src) {
    return Object.getOwnPropertyNames(src).forEach(function (prop) {
      if (prop !== 'constructor') {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(src, prop);
        Object.defineProperty(target, prop, propertyDescriptor);
      }
    });
  };

  var Emitter = function () {
    function Emitter() {
      _classCallCheck(this, Emitter);

      Object.defineProperty(this, 'listeners', {
        value: {},
        configurable: false,
        enumerable: false,
        writable: false
      });

      // TODO: secure the properties on this object
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
      value: function off() {
        var _this = this;

        if (arguments.length && !(typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' || typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function')) {
          throw new Error('The .off() method should be passed an event name (String), listener (Function), both, or neither.');
        }

        var eventName = typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' ? arguments.length <= 0 ? undefined : arguments[0] : null;
        var cb = typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function' ? arguments.length <= 0 ? undefined : arguments[0] : arguments.length <= 1 ? undefined : arguments[1];

        if (eventName && !(eventName in this.listeners)) {
          throw new Error('No listeners for "' + eventName + '" exist.');
        }

        // removes an individual listener from an event
        var removeListener = function removeListener(evName, callback) {
          _this.listeners[evName].delete(callback);
          if (!_this.listeners[evName].size) delete _this.listeners[evName];
        };

        // remove a single listener from a specific event
        if (eventName && cb) {

          removeListener(eventName, cb);

          // remove a specific listener from all events
        } else if (cb) {

          for (var ev in this.listeners) {
            if (this.listeners.hasOwnProperty(ev)) {
              removeListener(ev, cb);
            }
          }

          // remove all the listeners for an event
        } else if (eventName) {

          delete this.listeners[eventName];
        } else {
          for (var _ev in this.listeners) {
            if (this.listeners.hasOwnProperty(_ev)) {
              delete this.listeners[_ev];
            }
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

        if (typeof eventName !== 'string') {
          throw new Error('Event name must be a string.');
        }

        if (typeof cb !== 'function') {
          throw new Error('Callback must be a function.');
        }

        if (!(eventName in this.listeners)) {
          this.listeners[eventName] = new Set();
        }

        this.listeners[eventName].add(cb);
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

        // cb must be a function
        if (typeof cb !== 'function') throw new Error('Callback must be a function.');

        // removes the event listener, then runs the original callback
        var proxyHandler = function proxyHandler() {
          _this2.off(eventName, proxyHandler);
          cb.apply(undefined, arguments);
        };

        this.on(eventName, proxyHandler);
      }

      /**
       * Extends the Event Emitter to another object, making that object an Emitter mixin
       * @static
       * @function
       * @param {Object} obj        The object to extend the Event Emitter methods to
       * @return {Object} obj       Returns the original object, with the Event Emitter methods attached
       */

    }], [{
      key: 'extend',
      value: function extend() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        assign(obj, this.prototype);
        assign(obj, new Emitter());
        return obj;
      }
    }]);

    return Emitter;
  }();

  return Emitter;
}();