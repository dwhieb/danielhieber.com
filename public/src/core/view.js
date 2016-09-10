/**
 * A Class representing a View
 * @type {Proxy}
 * @class
 */
const View = new Proxy(class View {
  /**
   * Create a new View
   * @param {Object} el            An HTML Node to bind the view to
   * @param {Object|Array} data    An object or array to serve as the model for the view
   * @prop  {Object} el            The HTML node that has been bound to the view
   * @prop  {Object} nodes         An object containing references to any other nodes that are relevant to this view. It is recommended that this object be populated by using View.bind(), e.g. `"container": View.bind(containerEl)`.
   * @prop  {Object} model         If an object was passed as the model, this property will be present and contain a reference to the model.
   * @prop  {Array} collection     If an array was passed as the model/collection, this property will be present and contain a reference to that collection.
   */
  constructor(el, data) {

    this.el = View.bind(el);
    this.nodes = {};

    if (Array.isArray(data)) this.collection = data;
    else this.model = data;

  }

  /**
   * Displays the view, if hidden. Takes an optional `displayStyle` argument specifying what to set the `display` attribute of the element to (defaults to 'flex').
   * @method
   * @param {String} [displayStyle]       A string to set the `display` attribute to
   */
  display(displayStyle) {
    this.el.style.display = displayStyle || 'flex';
  }

  /**
   * Hides the view, if displayed.
   * @method
   */
  hide() {
    this.el.style.display = 'none';
  }

  /**
  * Removes all event listeners from the view's primary HTML node as well as any nodes in the `.nodes` object, and then removes the primary node from the DOM.
   * @method
   */
  remove() {
    this.stopListening();
    this.el.remove();
  }

  /**
   * Removes all event listeners from the view's primary HTML node, as well as any nodes in the `.nodes` object.
   * @method
   */
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

  /**
   * Extends an HTML Node with a `.listeners` array, and adds/removes listener objects to/from that array whenever `.addEventListener` and `.removeEventListener` are called.
   * @static
   * @param {Object} element        The HTML element to bind
   * @return {Object} element       Returns the HTML element
   */
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
