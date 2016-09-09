const View = new Proxy(class View {
  constructor(el, data) {

    this.el = View.bind(el);
    this.nodes = {};

    if (Array.isArray(data)) this.collection = data;
    else this.model = data;

  }

  display(displayStyle) {
    this.el.style.display = displayStyle || 'flex';
  }

  hide() {
    this.el.style.display = 'none';
  }

  remove() {
    this.stopListening();
    this.el.remove();
  }

  stopListening() {

    if (this.el.listeners) {

      const removeListeners = el => {
        el.listeners.forEach(listener => {
          const { type, handler, opts } = listener;
          el.removeEventListener(type, handler, opts);
        });
      };

      removeListeners(this.el);

      for (const el in this.nodes) {
        removeListeners(this.nodes[el]);
      }

    } else {
      return;
    }

  }

  static bind(el) {

    el.listeners = el.listeners || [];

    const registerListener = (...args) => {
      const [type, eventHandler, opts] = args;

      el.listeners.push({
        type,
        eventHandler,
        opts,
      });

      return el.addEventListener(...args);

    };

    const proxyHandler = {
      get(target, prop, receiver) {
        if (prop === 'addEventListener') return registerListener;
        return Reflect.get(target, prop, receiver);
      },
    };

    return new Proxy(el, proxyHandler);

  }

}, {
  construct(target, args) {

    if (!(args[0] instanceof Node)) {
      throw new Error('The `el` argument must be an instance of a Node.');
    }

    if (!(args[1] instanceof Object)) {
      throw new Error('The `model` argument must be an Object.');
    }

    return Reflect.construct(target, args);

  },
});
