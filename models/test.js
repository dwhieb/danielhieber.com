const Document = require('./document');

const Test = class Test extends Document {
  constructor(data) {
    const test = {};
    Object.assign(test, data);
    test.type = 'test';
    super(data);
  }
};

module.exports = Test;
