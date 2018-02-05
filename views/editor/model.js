const descriptor = {
  configurable: false,
  enumerable:   true,
  writable:     false,
};

module.exports = class Document {

  constructor({ cvid, type } = {}) {

    Object.defineProperties(this, {
      cvid: Object.assign({ value: cvid }, descriptor),
      type: Object.assign({ value: type }, descriptor),
    });

  }

};
