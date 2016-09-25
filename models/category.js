/* eslint-disable no-underscore-dangle */

const Document = require('./document');

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

    // tests for a valid ID string (a-z only)
    const validId = str => /^[a-z]{1,255}$/.test(str);

    // must have a valid ID string
    if (!validId(data.id)) throw new Error('Invalid format for `id` attribute.');

    return new Target(data);

  },
};

module.exports = new Proxy(Category, handler);
