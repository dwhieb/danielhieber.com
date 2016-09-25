/* eslint-disable no-underscore-dangle */

const Document = class Document {
  constructor(data = {}) {

    // string properties must be strings
    for (const attr in data) {
      if (typeof data[attr] !== 'string' && attr !== 'ttl' && attr !== '_ts') {
        throw new Error(`The '${attr}' attribute must be a string.`);
      }
    }

    // all documents must have a "type" attribute
    if (!data.type) throw new Error(`The "type" attribute is required.`);

    // 'ttl' must be an integer
    if (data.ttl && !Number.isInteger(data.ttl)) {
      throw new Error(`The 'ttl' attribute must be an integer.`);
    }

    // _ts must be an integer
    if (data._ts && !Number.isInteger(data._ts)) {
      throw new Error(`The '_ts' attribute must be an integer.`);
    }

    // copy over properties
    Object.assign(this, data);

    const attrs = [
      'id',
      'type',
      '_attachments',
      '_etag',
      '_rid',
      '_self',
      '_ts',
      // 'ttl',
    ];

    // make system properties read-only
    attrs.forEach(attr => {
      if (data[attr]) {
        Reflect.defineProperty(this, attr, {
          enumerable: true,
          value: data[attr],
        });
      }
    });

    // make the "ttl" attribute writable but not configurable
    Reflect.defineProperty(this, 'ttl', {});

  }
};

module.exports = Document;
