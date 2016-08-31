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

    const { id, name, description, ttl, type } = categoryData;

    const data = {
      id,
      name,
      description,
      ttl,
      type,
    };

    // no extra properties
    for (const attr in categoryData) {
      if (!Object.keys(data).includes(attr)) {
        throw new Error(`Unexpected attribute '${attr}' in category data. Cannot save category.`);
      }
    }

    // 'type' must be 'category' (if present)
    if (type && type !== 'category') {
      throw new Error(`If a 'type' attribute is included, it must be set to 'category'.`);
    }

    // 'ttl' must be an integer
    if (!Number.isInteger(ttl)) throw new Error(`'ttl' attribute must be an integer.`);

    for (const attr in data) {

      // must have required attributes
      if (attr !== 'type' && !data[attr]) throw new Error(`'${attr}' attribute required.`);

      // string properties must be strings
      if (attr !== 'ttl' && typeof attr !== 'string') {
        throw new Error(`'${attr}' must be a string.`);
      }

    }

    // tests for a valid ID string (a-z only)
    const validId = str => /^[a-z]+$/.test(str);

    // must have a valid ID string
    if (!validId(id)) throw new Error('Invalid format for `id` attribute.');

    return new Target(data);

  },
};

module.exports = new Proxy(Category, handler);
