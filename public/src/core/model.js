/* global Emitter */

/**
 * Events emitted by Model
 * @event Model#update
 */

/**
 * A class representing a Model
 * @type {Object} Model
 */
const Model = class Model {

  /**
   * Create a new Model
   * @param {Object} data         A plain-old JavaScript Object (POJO) with the data for the model
   * @prop {Object} data          A reference to the original data object passed to the model
   */

  constructor(data) {

    if (data instanceof Model) {
      Object.assign(this, data.json());
    } else if (data) {
      Object.assign(this, data);
    }

    Emitter.extend(this);

    // adjust property descriptors as needed
    Object.defineProperties(this, {

      data: {
        get: this.data,
      },

      destroy: {
        value: this.destroy,
        writable: true,
      },

      json: {
        value: this.json,
      },

      save: {
        value: this.save,
        writable: true,
      },

      update: {
        value: this.update,
      },

    });

  }

  /**
   * Returns a Plain-Old JavaScript Object (POJO) representation of the model
   * @return {Object}         Returns a POJO version of the model
   */
  data() {
    return JSON.parse(this.json());
  }

  /**
   * Delete this model from the database. This method should be overridden by the subclass.
   * @method
   */
  destroy() {
    throw new Error('No destroy method specified.');
  }

  /**
   * Retruns a JSON string representation of the model
   * @method
   * @return {String}     A JSON string representing the model
   */
  json() {
    return JSON.stringify(this, null, 2);
  }

  /**
   * Upsert this model to the database. This method should be overridden by the subclass.
   * @method
   */
  save() {
    throw new Error('No save method specified.');
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

};
