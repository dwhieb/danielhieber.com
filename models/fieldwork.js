const Document = require('./document');

const Fieldwork = class Fieldwork extends Document {
  constructor(data) {

    super(data, ['categories', 'description', 'location']);

  }
};

module.exports = Fieldwork;
