'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global Collection, Emitter, Model */

/**
 * Events emitted by View
 * @event View#destroy
 * @event View#display
 * @event View#hide
 * @event View#removeListeners
 */

/**
 * A Class representing a View
 * @type {Object}
 * @class
 */
var View = function () {
  /**
   * Create a new View
   * @param {Object} el            An HTML Node to bind the view to
   * @param {Object|Array} data    An object or array to serve as the model for the view
   * @prop  {Object} el            The HTML node that has been bound to the view
   * @prop  {Object} nodes         An object containing references to any other nodes that are relevant to this view. It is recommended that this object be populated by using View.bind(), e.g. `"container": View.bind(containerEl)`.
   * @prop  {Object} model         If an object was passed as the model, this property will be present and contain a reference to the model.
   * @prop  {Array} collection     If an array was passed as the model/collection, this property will be present and contain a reference to that collection.
   */
  function View(el, data) {
    _classCallCheck(this, View);

    if (!(el instanceof Node)) {
      throw new Error('The `el` argument must be an instance of a Node.');
    }

    if (data) {

      if (data instanceof Model) {
        this.model = data;
      } else if (data instanceof Collection) {
        this.collection = data;
      } else if (Array.isArray(data)) {
        this.collection = new Collection(data);
      } else if (data instanceof Object) {
        this.model = new Model(data);
      } else {
        throw new Error('The `data` argument must be an object or an array.');
      }
    } else {

      this.model = new Model({});
    }

    this.el = View.bind(el);
    this.nodes = {};

    Emitter.extend(this);
  }

  /**
   * Displays the view, if hidden. Takes an optional `displayStyle` argument specifying what to set the `display` attribute of the element to (defaults to 'flex').
   * @method
   * @param {String} [displayStyle]       A string to set the `display` attribute to
   */


  _createClass(View, [{
    key: 'display',
    value: function display(displayStyle) {
      this.el.style.display = displayStyle || 'flex';
      this.emit('display');
    }

    /**
     * Hides the view, if displayed.
     * @method
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.el.style.display = 'none';
      this.emit('hide');
    }

    /**
    * Removes all event listeners from the view's primary HTML node as well as any nodes in the `.nodes` object, and then removes the primary node from the DOM.
     * @method
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeListeners();
      this.el.remove();
      this.emit('destroy');
    }

    /**
     * Removes all event listeners from the view's primary HTML node, as well as any nodes in the `.nodes` object.
     * @method
     */

  }, {
    key: 'removeListeners',
    value: function removeListeners() {
      var _this = this;

      var removeListeners = function removeListeners(el) {

        if (_this.el.listeners) {

          el.listeners.forEach(function (listener) {
            var type = listener.type;
            var eventHandler = listener.eventHandler;
            var opts = listener.opts;

            el.removeEventListener(type, eventHandler, opts);
          });

          el.listeners.splice(0); // empty the array without redeclaring it
        }
      };

      removeListeners(this.el);

      for (var el in this.nodes) {
        removeListeners(this.nodes[el]);
      }

      this.emit('removeListeners');
    }

    /**
     * A generic render method that throws an error letting the user know that a more specific method needs to be defined on the subclass.
     */

  }, {
    key: 'render',
    value: function render() {
      throw new Error('No ".render()" method has been defined for this object. Please define a ".render()" method on the subclass.');
    }

    /**
     * Extends an HTML Node with a `.listeners` array, and adds/removes listener objects to/from that array whenever `.addEventListener` and `.removeEventListener` are called.
     * @static
     * @param {Object} element        The HTML element to bind
     * @return {Object} element       Returns the HTML element
     */

  }], [{
    key: 'bind',
    value: function bind(element) {

      if (!element) {
        throw new Error('Must pass a Node element to View.bind.');
      }

      var el = element;

      el.listeners = el.listeners || [];

      var proxyAdd = {
        apply: function apply(target, context, args) {
          var _args = _slicedToArray(args, 4);

          var type = _args[0];
          var eventHandler = _args[1];
          var opts = _args[2];
          var capture = _args[3];


          el.listeners.push({
            type: type,
            eventHandler: eventHandler,
            opts: opts,
            capture: capture
          });

          return Reflect.apply(target, context, args);
        }
      };

      var proxyRemove = {
        apply: function apply(target, context, args) {
          var _args2 = _slicedToArray(args, 4);

          var type = _args2[0];
          var eventHandler = _args2[1];
          var opts = _args2[2];
          var capture = _args2[3];


          var i = el.listeners.findIndex(function (listener) {
            return listener.type === type && listener.eventHandler === eventHandler && listener.opts === opts && listener.capture === capture;
          });

          if (i >= 0) {
            el.listeners.splice(i, 1);
          } else {
            throw new Error('Listener not found.');
          }

          return Reflect.apply(target, context, args);
        }
      };

      el.addEventListener = new Proxy(el.addEventListener, proxyAdd);
      el.removeEventListener = new Proxy(el.removeEventListener, proxyRemove);

      return el;
    }
  }]);

  return View;
}();