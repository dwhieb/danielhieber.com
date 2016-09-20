/* global Emitter, Model */

/**
 * Class representing a collection
 * @extends Array
 * @type {Array}
 */
const Collection = class Collection extends Array {
  /**
   * Create a collection
   * @class
   * @param {Array} [models]      The array of models for the collection
   * @param {Object} [model]      The default model to use for items in the collection
   */
  constructor(models, model = Model) {

    // instantiate the array
    if (Number.isInteger(models)) {
      super(models);
    } else if (Array.isArray(models)) {
      super(...models);
    } else {
      super();
    }

    // set the default model for items in the collection
    if (typeof models === 'function') {
      this.Model = models;
    } else {
      this.Model = model;
    }

    // make the collection an emitter
    Emitter.extend(this);

    // make sure each item in the collection is a model
    this.forEach(data => new this.Model(data));

  }

  /**
   * Add a model to the collection
   * @method
   * @param {Object} data         The model to add to the collection
   * @return {Number} length      Returns the new length of the collection array
   */
  add(data) {
    const model = new this.Model(data);
    this.push(model);
    this.emit('add', model);
    return this;
  }

  /**
   * Remove a model from the collection
   * @param {Object} model                The model to remove from the collection
   * @return {Array} deletedItems         Returns an array of the deleted items
   */
  remove(model) {
    const i = this.findIndex(el => Object.is(model, el));
    this.splice(i, 1);
    this.emit('remove', model);
    return this;
  }

};
