'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global Emitter, socket */

/**
 * Events emitted by Model
 * @event Model#destroy
 * @event Model#save
 * @event Model#update
 */

var Model = function () {
  function Model(data) {
    _classCallCheck(this, Model);

    // copy data to the model
    Object.assign(this, data);

    // make the model an event emitter
    Emitter.extend(this);

    // adjust property descriptors
    Object.defineProperties(Model.prototype, {
      data: {
        configurable: false
      },
      destroy: {
        configurable: false,
        writable: false
      },
      json: {
        configurable: false
      },
      save: {
        configurable: false,
        writable: false
      },
      update: {
        configurable: false,
        writable: false
      }
    });
  }

  /**
   * Delete this model from the database. This method should be overridden by the subclass.
   * @method
   * @return {Promise}        Returns a Promise that resolves to the success response
   */


  _createClass(Model, [{
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        socket.emit('delete', _this, function (err, res) {
          if (err) reject(err);
          _this.emit('destroy');
          resolve(res);
        });
      });
    }

    /**
     * Upsert this model to the database. This method should be overridden by the subclass.
     * @method
     * @return {Promise}        Returns a Promise that resolves to the new category
     */

  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        socket.emit('update', _this2, function (err, res) {
          if (err) reject(err);
          _this2.update(res);
          _this2.emit('save');
          resolve(res);
        });
      });
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

    /**
     * Returns a Plain-Old JavaScript Object (POJO) representation of the model
     * @return {Object}         Returns a POJO version of the model
     */

  }, {
    key: 'data',
    get: function get() {
      return JSON.parse(this.json);
    }

    /**
     * Retruns a JSON string representation of the model
     * @method
     * @return {String}     A JSON string representing the model
     */

  }, {
    key: 'json',
    get: function get() {
      return JSON.stringify(this, null, 2);
    }
  }]);

  return Model;
}();