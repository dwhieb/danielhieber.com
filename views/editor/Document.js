const descriptor = {
  configurable: false,
  enumerable:   true,
  writable:     false,
};

module.exports = class Document {

  constructor({ cvid, id, type } = {}) {

    Object.defineProperties(this, {
      cvid: Object.assign({ value: cvid }, descriptor),
      id:   Object.assign({ value: id }, descriptor),
      type: Object.assign({ value: type }, descriptor),
    });

  }

};
