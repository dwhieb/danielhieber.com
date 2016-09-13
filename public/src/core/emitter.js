/** A class representing an Event Emitter */
const Emitter = class Emitter {
  /**
   * Create a new Emitter instance
   * @class
   * @prop {Object} listeners         An object containing all the listeners for each event type
   */
  constructor() {
    this.listeners = {};
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
   * Removes all the listeners on the object, or all the listeners for a particular event if the `eventName` argument is passed.
   * @method
   * @param {String} [eventName]        (optional) The event name to remove any listeners from. If this argument is provided, listeners will only be removed from the given event name, not others. Otherwise, all listeners on the object are removed.
   * @param {Function} [listener]       (optional) The event listener to remove.
   */
  off(eventName, listener) {

    if (!(eventName in this.listeners)) {
      throw new Error(`No listeners for "${eventName}" exist.`);
    }

    if (typeof listener !== 'function') {
      throw new Error('`listener` must be a function.');
    }

    const i = this.listeners[eventName].findIndex(cb => Object.is(listener, cb));

    if (i >= 0) {
      this.listeners[eventName].splice(i, 1);
      if (this.listeners[eventName].length === 0) delete this.listeners[eventName];
    } else {
      throw new Error('Listener not found.');
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
      this.removeListener(eventName, proxyHandler);
      cb(...args); // eslint-disable-line callback-return
    };

    this.on(eventName, proxyHandler);

  }

  /**
   * Removes all the listeners on the object, or all the listeners for a particular event if the `eventName` argument is passed.
   * @method
   * @param {String} [eventName]        (optional) The event name to remove any listeners from. If this argument is provided, listeners will only be removed from the given event name, not others. Otherwise, all listeners on the object are removed.
   */
  removeListeners(eventName) {
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
  static extend(obj) {

    if (!obj) {
      throw new Error('This method must be passed an object to extend.');
    }

    const target = obj.prototype || obj;
    const source = this.prototype;

    Object.assign(target, new Emitter());

    Object.getOwnPropertyNames(source).forEach(prop => {
      if (prop !== 'constructor') {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop);
        Object.defineProperty(target, prop, propertyDescriptor);
      }
    });

    return target;

  }

};
