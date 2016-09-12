'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global Emitter */

/**
 * A class representing a Model
 * @type {Object} Model
 */
var Model = function () {
  /**
   * Create a new Model
   * @param {Object} data         A plain-old JavaScript Object (POJO) with the data for the model
   * @prop {Object} data          A reference to the original data object passed to the model
   */
  function Model(data) {
    _classCallCheck(this, Model);

    if (data) Object.assign(this, data);
    this.data = data || {};
    Emitter.extend(this);
  }

  /**
   * Delete this model from the database. This method should be overridden by the subclass.
   * @method
   */


  _createClass(Model, [{
    key: 'delete',
    value: function _delete() {
      throw new Error('No delete method specified.');
    }

    /**
     * Upsert this model to the database. This method should be overridden by the subclass.
     * @method
     */

  }, {
    key: 'save',
    value: function save() {
      throw new Error('No save method specified.');
    }

    /**
     * Partial update of this model (does not save to database)
     * @method
     * @param {Object} data         The data to update the model with
     * @return {Object} model       Returns this model
     */

  }, {
    key: 'update',
    value: function update(data) {
      Object.assign(this, data);
      this.emit('update', this);
      return this;
    }
  }]);

  return Model;
}();