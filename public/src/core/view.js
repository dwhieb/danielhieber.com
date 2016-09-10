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
          const { type, eventHandler, opts } = listener;
          el.removeEventListener(type, eventHandler, opts);
        });

        el.listeners.splice(0); // empty the array without redeclaring it

      };

      removeListeners(this.el);

      for (const el in this.nodes) {
        removeListeners(this.nodes[el]);
      }

    } else {
      return;
    }

  }

  static bind(element) {

    const el = element;

    el.listeners = el.listeners || [];

    const proxyAdd = {
      apply(target, context, args) {

        const [type, eventHandler, opts, capture] = args;

        el.listeners.push({
          type,
          eventHandler,
          opts,
          capture,
        });

        return Reflect.apply(target, context, args);

      },
    };

    const proxyRemove = {
      apply(target, context, args) {

        const [type, eventHandler, opts, capture] = args;

        const i = el.listeners.findIndex(listener => {
          return listener.type === type
              && listener.eventHandler === eventHandler
              && listener.opts === opts
              && listener.capture === capture;
        });

        if (i >= 0) {
          el.listeners.splice(i, 1);
        } else {
          throw new Error('Listener not found.');
        }


        return Reflect.apply(target, context, args);

      },
    };

    el.addEventListener = new Proxy(el.addEventListener, proxyAdd);
    el.removeEventListener = new Proxy(el.removeEventListener, proxyRemove);

    return el;

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
