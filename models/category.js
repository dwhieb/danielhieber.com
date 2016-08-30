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

    const { id, name, description } = args[0];
    const data = {
      id,
      name,
      description,
    };

    for (const attr in data) {
      if (!data[attr]) throw new Error(`'${attr}' attribute required.`);
      if (typeof attr !== 'string') throw new Error(`'${attr}' must be a string.`);
    }

    const validId = str => /^[a-z]+$/.test(str);
    if (!validId(id)) throw new Error('Invalid format for `id` attribute.');

    return new Target(data);

  },
};

module.exports = new Proxy(Category, handler);
