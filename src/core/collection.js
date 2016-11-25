/* global Emitter, Model */

/**
 * Events emitted by Collection
 * @event Collection#add
 * @event Collection#remove
 */

const Collection = class Collection extends Array {
  constructor(models) {

    // instantiate the array
    if (Number.isInteger(models)) {
      super(models);
    } else if (Array.isArray(models)) {
      super(...models);
    } else {
      super();
    }

    // make the collection an emitter
    Emitter.extend(this);

    // make sure each item in the collection is a model
    this.forEach((data, i) => {
      if (data instanceof Model) return;
      this[i] = new Model(data);
    });

  }

  /**
   * Add a model to the collection
   * @method
   * @param {Object} data         The model to add to the collection
   * @return {Number} length      Returns the new length of the collection array
   */
  add(data) {

    const model = new Model(data);

    this.push(model);
    this.emit('add', model);
    return this.length;

  }

  /**
   * Remove a model from the collection
   * @param {Object} model                The model to remove from the collection
   * @return {Array} deletedItems         Returns an array of the deleted items
   */
  remove(model) {

    const i = this.indexOf(model);

    if (i >= 0) {

      const removed = this.splice(i, 1);

      this.emit('remove', model);
      return removed;

    }

    return false;

  }

};
