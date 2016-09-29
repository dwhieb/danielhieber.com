const Document = require('./document');

/**
 * Class representing a research Category
 * @class Category
 * @extends Document
*/
const Category = class Category extends Document {
  /**
   * Create a new category
   * @param {Object} data               The new category data.
   * @param {String} data.title          A human-readable title for this category. HTML special characters should be escaped.
   * @param {String} data.abbr          A human-readable abbreviation for this category, as a string (no spaces, letters only)
   * @param {String} data.description   A description of this category. May contain Markdown. Accessing this property returns the markdown data, and setting it sets the "markdown" attribute.
   * @param {String} data.html          An HTML representation of the description.
   * @param {String} data.markdown      The original markdown content for the description. Setting this property also sets the value for the "description" attribute.
  */
  constructor(data = {}) {

    // required attributes
    const required = [
      'title',
      'description',
    ];

    // create an empty category object for copying data to
    const category = {};

    // check for required properties
    required.forEach(attr => {
      if (typeof data[attr] !== 'string') {
        throw new Error(`The "${attr}" attribute must be present and set to a string.`);
      }
    });

    // copy only whitelisted properties
    Category.whitelist.forEach(attr => {
      if (attr in data) category[attr] = data[attr];
    });

    // set abbreviation if none exists
    category.abbr = category.abbr
      || category.title
         .toLowerCase()
         .trim()
         .replace(/\s/g, '');

    // tests for a valid abbreviation string (a-z only)
    const validAbbr = str => /^[a-z]{1,255}$/.test(str);

    // must have a valid abbreviation string
    if (!validAbbr(category.abbr)) throw new Error(`Invalid format for the "abbr" attribute.`);

    // set the "type" attribute to "category"
    category.type = 'category';

    // construct a new Document
    super(category, ['title', 'description']);

    // adjust property descriptors for "abbr" attribute
    Object.defineProperty(this, 'abbr', {
      configurable: false,
      enumerable: true,
      writable: true,
    });

  }

  /**
   * Getter for whitelisted properties.
   * @method whitelist
   * @return {Array}  Returns the array of allowable properties.
   */
  static get whitelist() {
    return Document.whitelist.concat([
      'abbr',
      'description',
      'html',
      'markdown',
      'title',
    ]);
  }

};

module.exports = Category;
