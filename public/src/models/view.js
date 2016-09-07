(() => {

  class View {
    constructor(el, data) {

      this.el = this.databind(el);
      this.nodes = {};

      if (Array.isArray(data)) this.collection = data;
      else this.model = data;

      // TODO: return a Proxy that prevents overwriting certain properties, hides others, etc.

    }

    databind(el) {

      // TODO: if this never needs to refer to `this`, decouple it from View

      el.addEventListener = new Proxy(el.addEventListener, {
        apply(target, context, args) {

          const handler = args[1];

          el.listeners = el.listeners || [];

          el.listeners.push({
            type: args[0],
            handler: args[1],
            opts: args[2],
          });

          return Reflect.apply(target, context, args);

        },
      });

      return el;

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

      const removeListeners = el => {
        el.listeners.forEach(listener => {
          el.removeEventListener(listener.type, listener.handler, listener.opts);
        });
      };

      removeListeners(this.el);

      for (const el in this.nodes) {
        removeListeners(this.nodes[el]);
      }

    }

  }

  // export a Proxy for validating arguments when the View constructor is called
  modules.View = new Proxy(View, {
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

})();
