'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global View */

/* eslint-disable
  no-alert
*/

/**
 * Events emitted by CategoryView
 * @event CategoryView#destroy
 * @event CategoryView#error:{method}
 * @event CategoryView#remove
 * @event CategoryView#render
 * @event CategoryView#save
 * @event CategoryView#update
 */

/**
 * A class representing a Category View
 * @type {Object} CategoryView
 */
var CategoryView = function (_View) {
  _inherits(CategoryView, _View);

  /**
   * Create a new CategoryView
   * @param {Object} model          The model to attach to the view
   */
  function CategoryView(model) {
    _classCallCheck(this, CategoryView);

    // get the wrapper element for the category view
    var el = document.getElementById('details');

    // call the View class

    /**
     * An object containing references to each of the nodes used by this view
     * @type {Object}
     */
    var _this = _possibleConstructorReturn(this, (CategoryView.__proto__ || Object.getPrototypeOf(CategoryView)).call(this, el, model));

    _this.nodes = {
      name: View.bind(document.getElementById('name')),
      id: View.bind(document.getElementById('id')),
      description: View.bind(document.getElementById('description')),
      saveButton: View.bind(document.getElementById('saveButton')),
      deleteButton: View.bind(document.getElementById('deleteButton'))
    };

    // EVENT LISTENERS

    // update the model when the view changes
    _this.el.addEventListener('change', function (ev) {
      if (ev.target.id in _this.nodes) {
        _this.model.update(_defineProperty({}, ev.target.id, ev.target.value));
        _this.emit('update', _this.model);
      }
    });

    // save the model to the database when the Save button is clicked
    _this.nodes.saveButton.addEventListener('click', function () {
      _this.model.save().then(function () {
        return _this.emit('save', _this.model);
      }).catch(function (err) {
        return _this.emit('error:save', err);
      });
    });

    // delete the model from the database when the delete button is clicked
    _this.nodes.deleteButton.addEventListener('click', function () {

      var accepted = confirm('Are you sure you want to delete this category?');

      if (accepted) {
        _this.remove();
        _this.model.destroy().then(function () {
          return _this.emit('destroy', _this.model);
        }).catch(function (err) {
          if (err && err.status == 404) {
            _this.emit('destroy', _this.model);
          } else {
            _this.emit('error:destroy', err);
          }
        });
      }
    });

    return _this;
  }

  /**
   * Remove all event listeners from elements in this view, and hide (not delete) the view
   * @method
   * @return {Object} CategoryView      Returns the category view
   */


  _createClass(CategoryView, [{
    key: 'remove',
    value: function remove() {
      this.removeListeners();
      this.hide();
      this.emit('remove');
      return this;
    }

    /**
     * Renders this view, and displays the elements
     * @method
     * @return {Object} CategoryView        Returns the current instance of the category view
     */

  }, {
    key: 'render',
    value: function render() {
      this.nodes.description.value = this.model.description;
      this.nodes.id.value = this.model.id;
      this.nodes.name.value = this.model.name;
      this.display();
      this.emit('render');
      return this;
    }
  }]);

  return CategoryView;
}(View);