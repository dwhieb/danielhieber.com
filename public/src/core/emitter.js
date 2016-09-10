const Emitter = class Emitter {
  constructor() {
    this.listeners = {};
  }

  emit(eventName, ...args) {
    if (!(eventName in this.listeners)) {
      throw new Error(`"${eventName}" event does not exist.`);
    }

    this.listeners[eventName].forEach(cb => cb(...args));
  }

  on(eventName, cb) {
    if (typeof eventName !== 'string') throw new Error('Event name must be a string.');
    if (typeof cb !== 'function') throw new Error('Callback must be a function.');

    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(cb);
  }

  once(eventName, cb) {
    if (typeof cb !== 'function') throw new Error('Callback must be a function.');

    const proxyHandler = (...args) => {
      this.removeListener(eventName, proxyHandler);
      cb(...args); // eslint-disable-line callback-return
    };

    this.on(eventName, proxyHandler);

  }

  removeListener(eventName, listener) {
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

  removeListeners(eventName) {
    if (eventName) {
      if (typeof eventName !== 'string') throw new Error('Event name must be a string.');
      delete this.listeners[eventName];
    } else {
      this.listeners = {};
    }
  }

  static extend(obj) {

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
