class Document {
  constructor(data) {

    Object.assign(this, data);

    if (data.id) {
      Reflect.defineProperty(this, 'id', {
        enumerable: true,
        value: data.id,
      });
    }
  }
}

const handler = {
  construct(Target, args) {

    const [data] = args;

    // validate presence of attributes
    if (!data.type) throw new Error('`type` attribute required.');

    // validate attribute types
    if (typeof data.type !== 'string') throw new Error('`type` attribute must be a string.');
    if (data.id && typeof data.id !== 'string') throw new Error('`id` attribute must be a string.');

    return new Target(data);
  },
};

module.exports = {
  Document,
  ValidDocument: new Proxy(Document, handler),
};
