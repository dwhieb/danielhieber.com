(function view() {

  class View {
    constructor(el, data) {

      this.el = el;

      if (Array.isArray(data)) this.collection = data;
      else this.model = data;

      // TODO: return a Proxy that prevents overwriting certain properties, hides others, etc.
    }

    display() {}

    hide() {}

  }

  // export a Proxy for validating arguments when the View constructor is called
  modules.View = new Proxy(View, {
    construct(Target, args) {

      if (!(args[0] instanceof Node)) {
        throw new Error('The `el` argument must be an instance of a Node.');
      }

      if (!(args[1] instanceof Object)) {
        throw new Error('The `model` argument must be an Object.');
      }

      return new Target(...args);

    },
  });

}());
