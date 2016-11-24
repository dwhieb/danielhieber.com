/* global Emitter, socket */

/**
 * Events emitted by Model
 * @event Model#destroy
 * @event Model#save
 * @event Model#update
 */

const Model = class Model {
  constructor(data = {}) {

    if (data instanceof Model) return data;
    if (data.markdown) data.description = data.markdown;

    // copy data to the model
    Object.assign(this, data);

    // make the model an event emitter
    Emitter.extend(this);

    // adjust property descriptors
    Object.defineProperties(Model.prototype, {
      data: {
        configurable: false,
      },
      destroy: {
        configurable: false,
        writable: false,
      },
      json: {
        configurable: false,
      },
      save: {
        configurable: false,
        writable: false,
      },
      update: {
        configurable: false,
        writable: false,
      },
    });

  }

  /**
   * Delete this model from the database. This method should be overridden by the subclass.
   * @method
   * @return {Promise}        Returns a Promise that resolves to the success response
   */
  destroy() {
    return new Promise((resolve, reject) => {
      socket.emit('delete', this, (err, res) => {
        if (err) reject(err);
        this.emit('destroy');
        resolve(res);
      });
    });
  }

  /**
   * Upsert this model to the database. This method should be overridden by the subclass.
   * @method
   * @return {Promise}        Returns a Promise that resolves to the new category
   */
  save() {
    return new Promise((resolve, reject) => {
      socket.emit('update', this, (err, res) => {
        if (err) reject(err);
        this.update(res);
        this.emit('save');
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
  update(data) {
    Object.assign(this, data);
    this.emit('update', this);
    return this;
  }

  /**
   * Returns a Plain-Old JavaScript Object (POJO) representation of the model
   * @return {Object}         Returns a POJO version of the model
   */
  get data() {
    return JSON.parse(this.json);
  }

  /**
   * Retruns a JSON string representation of the model
   * @method
   * @return {String}     A JSON string representing the model
   */
  get json() {
    return JSON.stringify(this, null, 2);
  }

};

socket.emit('getWhitelist', (err, res) => {
  if (err) Model.whitelist = {};
  else Model.whitelist = res;
});
