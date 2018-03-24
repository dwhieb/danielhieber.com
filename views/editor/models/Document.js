const descriptor = {
  configurable: false,
  enumerable:   true,
  writable:     false,
};

module.exports = class Document {

  constructor({ cvid, id, type } = {}) {

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
