/* eslint-disable no-underscore-dangle */

const Document = require('./document').Document;

/**
 * Class representing a research Category
 * @extends Document
 */
class Category extends Document {
  /**
   * Create a new category
   * @param {Object} data               The new category data.
   * @param {String} data.id            The ID of the category, as a string (no spaces, letters only)
   * @param {String} data.name          A human-readable name for this category. HTML special characters should be escaped.
   * @param {String} data.description   A description of this category. May contain HTML.
   */
  constructor(data) {
    super(Object.assign({ type: 'category' }, data));
  }
}

const handler = {
  construct(Target, args) {

    const categoryData = args[0];

    const whitelist = [
      'id',
      'name',
      'description',
      'ttl',
      '_attachments',
      '_etag',
      '_rid',
      '_self',
      '_ts',
    ];

    const required = [
      'id',
      'name',
      'description',
    ];

    const data = { type: 'category' };

    // copy only whitelisted properties
    whitelist.forEach(attr => {
      if (attr in categoryData) {
        data[attr] = categoryData[attr];
      }
    });

    // check for required properties
    required.forEach(attr => {
      if (!data[attr]) {
        throw new Error(`Category must have a value for the '${attr}' attribute.`);
      }
    });

    // string properties must be strings
    for (const attr in data) {
      if (typeof data[attr] !== 'string' && attr !== 'ttl' && attr !== '_ts') {
        throw new Error(`The '${attr}' attribute must be a string.`);
      }
    }

    // tests for a valid ID string (a-z only)
    const validId = str => /^[a-z]{1,255}$/.test(str);

    // must have a valid ID string
    if (!validId(data.id)) throw new Error('Invalid format for `id` attribute.');

    // 'ttl' must be an integer
    if (data.ttl && !Number.isInteger(data.ttl)) {
      throw new Error(`The 'ttl' attribute must be an integer.`);
    }

    // _ts must be an integer
    if (data._ts && !Number.isInteger(data._ts)) {
      throw new Error(`The '_ts' attribute must be an integer.`);
    }

    return new Target(data);

  },
};

module.exports = new Proxy(Category, handler);
