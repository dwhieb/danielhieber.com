/* global Emitter */

const Collection = class Collection extends Array {
  constructor(data) {
    if (!Array.isArray(data)) throw new Error('Collection must be an array.');

    super(...data);

    // NB: extending native classes is not supported by Babel
    // these methods have to be added in the constructor

    this.add = model => {
      this.push(model);
    };

    this.remove = model => {
      const i = this.findIndex(el => Object.is(model, el));
      this.splice(i, 1);
    };

    return Reflect.construct(Array, [data], Collection);

  }
};

Reflect.setPrototypeOf(Collection, Array);
Reflect.setPrototypeOf(Collection.prototype, Array.prototype);
