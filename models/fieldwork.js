const Document = require('./document');

const props = [
  'categories',
  'description',
  'endYear',
  'location',
  'startYear',
];

const Fieldwork = class Fieldwork extends Document {
  constructor(data) {

    const required = [
      'description',
      'location',
      'startYear',
    ];

    const fw = {};

    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    Fieldwork.whitelist.forEach(attr => {
      if (attr in data) fw[attr] = data[attr];
    });

    fw.type = 'fieldwork';

    super(data, props);

  }

  static get whitelist() {
    return Document.whitelist.concat(props);
  }

};

module.exports = Fieldwork;
