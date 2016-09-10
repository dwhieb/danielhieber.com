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

    this.listeners = {};
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

      if (!(eventName in this.listeners)) {
        throw new Error('"' + eventName + '" event does not exist.');
      }

      this.listeners[eventName].forEach(function (cb) {
        return cb.apply(undefined, args);
      });
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
      var _this = this;

      if (typeof cb !== 'function') throw new Error('Callback must be a function.');

      var proxyHandler = function proxyHandler() {
        _this.removeListener(eventName, proxyHandler);
        cb.apply(undefined, arguments); // eslint-disable-line callback-return
      };

      this.on(eventName, proxyHandler);
    }

    /**
     * Removes a specific listener for a specific event
     * @method
     * @param {String} eventName          The name of the even to remove the listener from
     * @param {Function} listener         The listener to remove from the event
     */

  }, {
    key: 'removeListener',
    value: function removeListener(eventName, listener) {
      if (!(eventName in this.listeners)) {
        throw new Error('No listeners for "' + eventName + '" exist.');
      }

      if (typeof listener !== 'function') {
        throw new Error('`listener` must be a function.');
      }

      var i = this.listeners[eventName].findIndex(function (cb) {
        return Object.is(listener, cb);
      });

      if (i >= 0) {
        this.listeners[eventName].splice(i, 1);
        if (this.listeners[eventName].length === 0) delete this.listeners[eventName];
      } else {
        throw new Error('Listener not found.');
      }
    }

    /**
     * Removes all the listeners on the object, or all the listeners for a particular event if the `eventName` argument is passed.
     * @method
     * @param {String} [eventName]        (optional) The event name to remove any listeners from. If this argument is provided, listeners will only be removed from the given event name, not others. Otherwise, all listeners on the object are removed.
     */

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

    /**
     * Extends
     * @static
     * @function
     * @param {Object} obj        The object to extend the Event Emitter methods to
     * @return {Object} obj       Returns the original object, with the Event Emitter methods attached
     */

  }], [{
    key: 'extend',
    value: function extend(obj) {

      if (!obj) {
        throw new Error('This method must be passed an object to extend.');
      }

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