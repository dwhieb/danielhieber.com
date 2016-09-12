/* global Emitter */

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
   */
  constructor(models) {

    if (Number.isInteger(models)) {
      super(models);
    } else if (models && !Array.isArray(models)) {
      throw new Error('Collection constructor must be passed an array.');
    } else if (models) {
      super(...models);
    } else {
      super();
    }

    Emitter.extend(this);

  }

  /**
   * Add a model to the collection
   * @method
   * @param {Object} model        The model to add to the collection
   * @return {Number} length      Returns the new length of the collection array
   */
  add(model) {
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
