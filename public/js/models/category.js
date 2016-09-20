'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global Model */

// the default Category data to use if none is provided
var defaults = {
  id: '',
  name: '',
  description: ''
};

/**
 * A class representing a Category
 * @type {Object} Category
 */
var Category = function (_Model) {
  _inherits(Category, _Model);

  /**
   * Create a new instance of a Category
   * @type {Object} Category
   * @param {Object} [data]     The JSON data to create the category from
   */
  function Category() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? defaults : arguments[0];

    _classCallCheck(this, Category);

    var temp = Object.assign({}, defaults);
    Object.assign(temp, data);
    return _possibleConstructorReturn(this, (Category.__proto__ || Object.getPrototypeOf(Category)).call(this, temp));
  }

  /**
   * Delete this category from the database
   * @method
   * @return {Promise} Resolves to a JSON object when the category is deleted
   */


  _createClass(Category, [{
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        socket.emit('deleteCategory', _this2, function (err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    }

    /**
     * Save (upsert) this category to the database
     * @method
     * @return {Promise} Resolves to a JSON object when the category is saved
     */

  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        socket.emit('updateCategory', _this3, function (err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    }
  }]);

  return Category;
}(Model);