/* eslint-disable no-underscore-dangle */

const Document = require('./document');
const md = require('markdown').markdown;

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
        throw new Error(`The "${attr}" attribute must be present, and must be set to a string.`);
      }
    });

    const whitelist = [
      'abbr',
      'description',
      'html',
      'markdown',
      'title',
    ];

    // copy only whitelisted properties
    whitelist.forEach(attr => {
      if (attr in data && attr !== 'description') {
        category[attr] = data[attr];
      }
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
    super(category, ['title', ['whitelist', whitelist]]);

    // set initial attribute values and adjust property descriptors
    Object.defineProperties(this, {

      abbr: {
        configurable: false,
        enumerable: true,
        writable: true,
      },

      html: {
        value: this.html || md.toHTML(data.description),
        configurable: false,
        enumerable: true,
        writable: true,
      },

      markdown: {
        value: this.markdown || data.description,
        configurable: false,
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
  // static get whitelist() {
  //   return Document.whitelist.concat([
  //     'abbr',
  //     'description',
  //     'html',
  //     'markdown',
  //     'title',
  //   ]);
  // }

};

module.exports = Category;
