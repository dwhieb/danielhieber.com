/* global Emitter */

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
    if (data) Object.assign(this, data);
    this.data = data || {};
    Emitter.extend(this);
  }

  /**
   * Delete this model from the database. This method should be overridden by the subclass.
   * @method
   */
  delete() {
    throw new Error('No delete method specified.');
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
