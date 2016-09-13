'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

/* global Emitter, Model */

/**
 * Class representing a collection
 * @extends Array
 * @type {Array}
 */
var Collection = function (_extendableBuiltin2) {
  _inherits(Collection, _extendableBuiltin2);

  /**
   * Create a collection
   * @class
   * @param {Array} [models]      The array of models for the collection
   */
  function Collection(models) {
    _classCallCheck(this, Collection);

    // instantiate the array
    if (Number.isInteger(models)) {
      var _this = _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).call(this, models));
    } else if (models && !Array.isArray(models)) {
      throw new Error('Collection constructor should be passed an array.');
    } else if (models) {
      var _ref;

      var _this = _possibleConstructorReturn(this, (_ref = Collection.__proto__ || Object.getPrototypeOf(Collection)).call.apply(_ref, [this].concat(_toConsumableArray(models))));
    } else {
      var _this = _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).call(this));
    }

    // make the collection an emitter
    Emitter.extend(_this);

    // make sure each item in the collection is a model
    _this.forEach(function (data) {
      return new Model(data);
    });

    return _possibleConstructorReturn(_this);
  }

  /**
   * Add a model to the collection
   * @method
   * @param {Object} model        The model to add to the collection
   * @return {Number} length      Returns the new length of the collection array
   */


  _createClass(Collection, [{
    key: 'add',
    value: function add(data) {
      var model = new Model(data);
      this.push(model);
      this.emit('add', model);
      return this;
    }

    /**
     * Remove a model from the collection
     * @param {Object} model                The model to remove from the collection
     * @return {Array} deletedItems         Returns an array of the deleted items
     */

  }, {
    key: 'remove',
    value: function remove(model) {
      var i = this.findIndex(function (el) {
        return Object.is(model, el);
      });
      this.splice(i, 1);
      this.emit('remove', model);
      return this;
    }
  }]);

  return Collection;
}(_extendableBuiltin(Array));