/** A class representing an Event Emitter */
const Emitter = class Emitter {
  /**
   * Create a new Emitter instance
   * @class
   * @prop {Object} listeners         An object containing all the listeners for each event type
   */
  constructor() {
    Object.defineProperty(this, 'listeners', {
      value: {},
    });
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
  off(eventName, listener) {

    if (eventName && (typeof eventName !== 'string' && typeof eventName !== 'function')) {
      throw new Error(`The .off() method should be passed an event name (String), listener (Function), both, or neither.`);
    }

    const event = typeof eventName === 'string' ? eventName : undefined;
    const cb = typeof eventName === 'function' ? eventName : listener;

    if (event && !(event in this.listeners)) {
      throw new Error(`No listeners for "${eventName}" exist.`);
    }

    const removeListener = (evName, listenerFunc) => {

      const i = this.listeners[evName].findIndex(func => Object.is(func, listenerFunc));

      // this requires explicit comparison b/c the index may sometimes be zero
      if (i >= 0) {
        this.listeners[evName].splice(i, 1);
        if (this.listeners[evName].length === 0) delete this.listeners[evName];
        return true;
      }

      return false;

    };

    if (event && cb) {

      removeListener(event, cb);

    } else if (cb) {

      for (const evName in this.listeners) {
        removeListener(evName, cb);
      }

    } else if (event) {

      delete this.listeners[event];

    } else {

      for (const prop in this.listeners) {
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
  on(eventName, cb) {
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
  once(eventName, cb) {
    if (typeof cb !== 'function') throw new Error('Callback must be a function.');

    const proxyHandler = (...args) => {
      this.off(eventName, proxyHandler);
      cb(...args);
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
  static extend(obj = {}) {

    const target = obj.prototype || obj;
    const source = this.prototype;

    const assign = (tgt, src) => Object.getOwnPropertyNames(src).forEach(prop => {
      if (prop !== 'constructor') {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(src, prop);
        Object.defineProperty(tgt, prop, propertyDescriptor);
      }
    });

    assign(target, source);
    assign(target, new Emitter());

    return target;

  }

};
