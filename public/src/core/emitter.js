const Emitter = (function() {

  const assign = (target, src) => Object.getOwnPropertyNames(src).forEach(prop => {
    if (prop !== 'constructor') {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(src, prop);
      Object.defineProperty(target, prop, propertyDescriptor);
    }
  });

  const Emitter = class Emitter {
    constructor() {

      Object.defineProperty(this, 'listeners', {
        value: {},
        configurable: false,
        enumerable: false,
        writable: false,
      });

      // TODO: secure the properties on this object

    }

    /**
     * Calls the callback functions registered for the given event name
     * @method
     * @param {String} eventName    The event name to fire
     * @param {Any}    [args]       The remaining arguments to pass to the event callback
     */
    emit(eventName, ...args) {
      if (eventName in this.listeners) {
        this.listeners[eventName].forEach(cb => cb(...args));
      }
    }

    /**
     * Removes listeners from the object. If no arguments are provided, all listeners are removed. If only an eventName is provided, all listeners are removed for that event name. If only a listener is provided, that listener is removed from all events. If both an event name and listener are provided, only that particular listener for that particular event is removed.
     * @method
     * @param {String} [eventName]       The event to remove listeners for.
     * @param {Function} [listener]      The listener to remove.
     */
    off(...args) {

      if (
        args.length
        && !(typeof args[0] === 'string'
          || typeof args[0] === 'function')
      ) {
        throw new Error(`The .off() method should be passed an event name (String), listener (Function), both, or neither.`);
      }

      const eventName = typeof args[0] === 'string' ? args[0] : null;
      const cb = typeof args[0] === 'function' ? args[0] : args[1];

      if (eventName && !(eventName in this.listeners)) {
        throw new Error(`No listeners for "${eventName}" exist.`);
      }

      // removes an individual listener from an event
      const removeListener = (evName, callback) => {
        this.listeners[evName].delete(callback);
        if (!this.listeners[evName].size) delete this.listeners[evName];
      };

      // remove a single listener from a specific event
      if (eventName && cb) {

        removeListener(eventName, cb);

      // remove a specific listener from all events
      } else if (cb) {

        for (const ev in this.listeners) {
          if (this.listeners.hasOwnProperty(ev)) {
            removeListener(ev, cb);
          }
        }

      // remove all the listeners for an event
      } else if (eventName) {

        delete this.listeners[eventName];

      } else {
        for (const ev in this.listeners) {
          if (this.listeners.hasOwnProperty(ev)) {
            delete this.listeners[ev];
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
    on(eventName, cb) {

      if (typeof eventName !== 'string') {
        throw new Error('Event name must be a string.');
      }

      if (typeof cb !== 'function') {
        throw new Error('Callback must be a function.');
      }

      if (!(eventName in this.listeners)) {
        this.listeners[eventName] = new Set;
      }

      this.listeners[eventName].add(cb);

    }

    /**
     * Attach a listener to an event that will only fire the first time the event occurs
     * @method
     * @param {String} eventName      The name of the event to attach the listener to
     * @param {Function} cb           The callback function (the listener) to fire when the event is triggered. This callback will only fire once.
     */
    once(eventName, cb) {

      // cb must be a function
      if (typeof cb !== 'function') throw new Error('Callback must be a function.');

      // removes the event listener, then runs the original callback
      const proxyHandler = (...args) => {
        this.off(eventName, proxyHandler);
        cb(...args);
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
    static extend(obj = {}) {
      assign(obj, this.prototype);
      assign(obj, new Emitter());
      return obj;
    }

  };

  return Emitter;

}());
