const typesMap = require('../types');

const descriptor = {
  configurable: false,
  enumerable:   true,
  writable:     false,
};

const types = Object.values(typesMap);

module.exports = class Document {

  constructor({ cvid, id, type } = {}) {

    // Validation

    if (!Number.isInteger(cvid)) {
      throw new TypeError(`cvid must be an Integer.`);
    }

    if (typeof id !== `undefined` && typeof id !== `string`) {
      throw new TypeError(`id must be a String.`);
    }

    if (!types.includes(type)) {
      throw new TypeError(`Invalid type attribute.`);
    }

    // Assign properties

    Object.defineProperties(this, {
      cvid: Object.assign({ value: cvid }, descriptor),
      type: Object.assign({ value: type }, descriptor),
    });

    if (id) this.id = id;

  }

  set id(value) {
    Object.defineProperty(this, `id`, Object.assign({ value }, descriptor));
  }

};
