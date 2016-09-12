const Model = class Model {
  constructor(data) {
    Object.assign(this, data);
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
    return this;
  }

};
