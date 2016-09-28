/* eslint-disable no-underscore-dangle */

const Document = require('./document');
const md = require('markdown');

/**
 * Class representing a research Category
 * @class Category
 * @extends Document
*/
const Category = class Category extends Document {
  /**
   * Create a new category
   * @param {Object} data               The new category data.
   * @param {String} data.name          A human-readable name for this category. HTML special characters should be escaped.
   * @param {String} data.abbr          A human-readable abbreviation for this category, as a string (no spaces, letters only)
   * @param {String} data.description   A description of this category. May contain Markdown. Accessing this property returns the markdown data, and setting it sets the "markdown" attribute.
   * @param {String} data.html          An HTML representation of the description.
   * @param {String} data.markdown      The original markdown content for the description. Setting this property also sets the value for the "description" attribute.
  */
  constructor(data = {}) {

    // required attributes
    const required = [
      'name',
      'description',
    ];

    // template for Category data
    const doc = { type: 'category' };

    // check for required properties
    required.forEach(attr => {
      if (!data[attr]) throw new Error(`Category must have a value for the "${attr}" attribute.`);
    });

    // copy only whitelisted properties
    Category.whitelist.forEach(attr => {
      if (attr in data && attr !== 'description') {
        doc[attr] = data[attr];
      }
    });

    // set abbreviation if none exists
    doc.abbr = doc.abbr
      || doc.name
         .toLowerCase()
         .trim()
         .replace(/\s/g, '');

    // tests for a valid abbreviation string (a-z only)
    const validAbbr = str => /^[a-z]{1,255}$/.test(str);

    // must have a valid abbreviation string
    if (!validAbbr(doc.abbr)) throw new Error(`Invalid format for the "abbr" attribute.`);

    // construct a new document
    super(doc);

    // set initial attribute values and adjust property descriptors
    Object.defineProperties(this, {

      abbr: {
        enumerable: true,
        writable: true,
      },

      html: {
        value: this.html || '',
        enumerable: true,
        writable: true,
      },

      markdown: {
        value: this.markdown || md.toHTML(data.description),
        enumerable: true,
      },

      name: {
        enumerable: true,
        writable: true,
      },

    });

  }

  /**
   * Getter for the "description" attribute. Returns the value from the "markdown" property.
   * @method description
   * @return {String}    Returns the markdown data.
   */
  get description() {
    return this.markdown || '';
  }

  /**
   * Setter for the "description" attribute.
   * @method description
   * @param  {String} val     The value to set the "description" attribute to.
   * @return {String} description     Returns the "description" string just passed.
   */
  set description(val) {
    this.markdown = String(val);
    this.html = md.toHTML(this.markdown);
    return this.markdown;
  }

  /**
   * Getter for whitelisted properties.
   * @method whitelist
   * @return {Array}  Returns the array of allowable properties.
   */
  static get whitelist() {
    return Document.whitelist.concat([
      'name',
      'abbr',
      'html',
      'markdown',
      'description',
    ]);
  }

};

module.exports = Category;
