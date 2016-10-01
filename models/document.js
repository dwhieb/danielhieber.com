/* eslint-disable no-underscore-dangle */

const md = require('markdown').markdown;
const validUrl = require('valid-url');

/**
 * A class representing a DocumentDB document
 * @class Document
 */
const Document = class Document {
  /**
   * Create a new Document
   * @param {Object} data                The document data
   * @param {String} [data.id]           The document ID
   * @param {String} data.type           The document type
   * @param {String} [data._attachments] The attachments URL
   * @param {String} [data._etag]        The document ETag
   * @param {String} [data._rid]         The unique resource identifier of the document
   * @param {String} [data._self]        The self-link for the document
   * @param {Integer} [data._ts]         The timestampe for the document
   * @param {Integer} [data.ttl]         The time-to-live for the document
   * @param {Array} [properties]         An array of the properties to add to the subclass.
   */
  constructor(data = {}, properties = []) {

    // document data must be an object
    if (typeof data !== 'object') throw new Error(`The "data" argument must be an Object.`);

    // convert "properties" argument to an array if needed
    const props = Array.isArray(properties) ? properties : [properties];

    // string properties must be strings
    Document.whitelist.forEach(attr => {
      if (
        attr in data
        && attr !== 'ttl'
        && attr !== '_ts'
        && typeof data[attr] !== 'string'
      ) {
        throw new Error(`The "${attr}" attribute must be a string.`);
      }
    });

    // all documents must have a "type" attribute
    if (!data.type) throw new Error(`The "type" attribute is required.`);

    // _ts must be an integer
    if (data._ts && !Number.isInteger(data._ts)) {
      throw new Error(`The "_ts" attribute must be an integer.`);
    }

    // variable for storing TTL attribute
    let ttl = data.ttl;

    // define getter and setter for "ttl" attribute
    Object.defineProperty(this, 'ttl', {
      configurable: false,
      enumerable: true,
      get: () => ttl,
      set: val => {
        if (!Number.isInteger(val)) throw new Error(`"ttl" attribute must be an integer.`);
        ttl = val;
      },
    });

    // copy over properties
    Object.assign(this, data);

    // make system properties read-only
    Document.whitelist.forEach(attr => {
      if (data[attr] && attr !== 'ttl') {
        Object.defineProperty(this, attr, {
          value: data[attr],
          configurable: false,
          enumerable: true,
          writable: false,
        });
      }
    });

    const minYear = 1986; // minimum year allowed for "year", "startYear", and "endYear" properties
    const maxYear = 2100; // maximum year allowed for "year", "startYear", and "endYear" properties

    // a hash of private variables (allows string attributes to be defined dynamically)
    const _private = {};

    // define properties on the subclass that have been specified in the "properties" argument
    props.forEach(property => {

      const prop = Array.isArray(property) ? property[0] : property;
      const args = Array.isArray(property) ? property.slice(1) : [];

      // property name must be a string
      if (typeof prop !== 'string') {
        throw new Error(`Property names in the "properties" argument must be strings.`);
      }

      const stringProps = [
        'author',
        'autonym',
        'competency',
        'location',
        'organization',
        'program',
        'publication',
        'title',
      ];

      // if the property to add is a simple string property, use the generic string definition
      if (stringProps.includes(prop)) {

        // set the property descriptor
        Object.defineProperty(this, prop, {
          configurable: false,
          enumerable: true,
          get() { return _private[prop]; },
          set(val) {
            _private[prop] = String(val);
            return _private[prop];
          },
        });

        // initialize the value of the string property
        if (data[prop]) this[prop] = data[prop];

      // otherwise, use the specific property definitions
      } else {

        switch (prop) {

          // define the "categories" attribute and its associated methods
          case 'categories': {

            // array for getter and setter to use in storing categories
            const categories = new Set();

            Object.defineProperties(this, {

              // define the "categories" attribute
              categories: {
                configurable: false,
                enumerable: true,
                get() { return Array.from(categories); },
              },

              // define the ".addCategory()" method
              addCategory: {
                value: category => {
                  if (typeof category === 'string') {
                    return Array.from(categories.add(category));
                  }
                  throw new Error('The name of the category must be a string.');
                },
                configurable: false,
                enumerable: false,
                writable: false,
              },

              // define the ".hasCategory()" method
              hasCategory: {
                value: category => categories.has(category),
                configurable: false,
                enumerable: false,
                writable: false,
              },

              // define the ".removeCategory()" method
              removeCategory: {
                value: category => categories.delete(category),
                configurable: false,
                enumerable: false,
                writable: false,
              },

            });

            // set the initial value of the "categories" attribute
            if (Array.isArray(data.categories) || data.categories instanceof Set) {
              data.categories.forEach(this.addCategory);
            }

            break;

          }

          // define the "description" attribute and its associated "html" and "markdown" attributes
          case 'description': {

            // variables for getters and setters to store HTML and Markdown data
            let html = '';
            let markdown = '';

            Object.defineProperties(this, {

              // define the "description" attribute
              description: {
                configurable: false,
                enumerable: false,
                get() { return markdown; },
                set(val) {
                  // set the "markdown" and "html" attributes whenever the "description" attribute is set
                  markdown = String(val);
                  html = md.toHTML(markdown);
                  return markdown;
                },
              },

              // define the "html" attribute
              html: {
                configurable: false,
                enumerable: true,
                get() { return html; },
              },

              // define the "markdown" attribute
              markdown: {
                configurable: false,
                enumerable: true,
                get() {
                  return markdown;
                },
              },

            });

            // set the initial values for the "description", "html", and "markdown" attributes
            if (data.description || data.markdown) {
              this.description = data.description || data.markdown;
            }

            break;

          }

          case 'endYear': {

            let endYear;

            Object.defineProperty(this, 'endYear', {
              configurable: false,
              enumerable: true,
              get() { return endYear; },
              set(val) {

                if (
                  (Number.isInteger(val) && minYear <= val && val <= maxYear)
                  || (typeof val === 'string' && val === 'present')
                  || val === null
                ) {
                  endYear = val;
                  return endYear;
                }

                throw new Error('The "endYear" attribute is incorrectly formatted.');

              },
            });

            if (data.endYear) this.endYear = data.endYear;

            break;

          }

          // define the "links" attribute and its associated methods
          case 'links': {

            // a hash for the getters and setters to store links in
            const links = {};

            Object.defineProperties(this, {

              // define the "links" attribute
              links: {
                configurable: false,
                enumerable: true,
                get() { return Object.assign({}, links); }, // don't return the actual links object
              },

              // define the ".addLink()" method
              addLink: {
                value: (linkName, url) => {

                  // linkName must be a string
                  if (typeof linkName !== 'string') {
                    throw new Error(`The "linkName" argument must be a string.`);
                  }

                  // URL must be a valid URI string
                  if (validUrl.isUri(url)) {
                    links[linkName] = url;
                    return Object.assign({}, links); // don't return the actual links object
                  }

                  throw new Error(`The provided URL "${url}" is not a valid URL string.`);

                },
                configurable: false,
                enumerable: false,
                writable: false,
              },

              // define the ".getLink()" method
              getLink: {
                value: linkName => links[linkName],
                configurable: false,
                enumerable: false,
                writable: false,
              },

              // define the ".removeLink()" method
              removeLink: {
                value: linkName => Reflect.deleteProperty(links, linkName),
                configurable: false,
                enumerable: false,
                writable: false,
              },

            });

            // set the initial value of the "links" attribute
            if (data.links && typeof data.links === 'object') {
              for (const linkName in data.links) {
                if (data.links.hasOwnProperty(linkName)) {
                  this.addLink(linkName, data.links[linkName]);
                }
              }
            }

            break;

          }

          case 'startYear': {

            let startYear;

            Object.defineProperty(this, 'startYear', {
              configurable: false,
              enumerable: true,
              get() { return startYear; },
              set(val) {
                if (Number.isInteger(val) && minYear <= val && val <= maxYear) {
                  startYear = val;
                  return startYear;
                }
                throw new Error('The "startYear" attribute must be an integer from `1986` to `2100`.');
              },
            });

            if (data.startYear) this.startYear = data.startYear;

            break;

          }

          case 'year': {

            let year;

            Object.defineProperty(this, 'year', {
              configurable: false,
              enumerable: true,
              get() { return year; },
              set(val) {
                if (Number.isInteger(val) && minYear <= val && val <= maxYear) {
                  year = val;
                  return val;
                }
                throw new Error('The "year" attribute must be an integer from 1985 to 2100.');
              },
            });

            if (data.year) this.year = data.year;

            break;

          }

          default:
            throw new Error(`Unrecognized property "${prop}".`);

        }

      }

    });

  }

  /**
   * Document.whitelist
   * @method whitelist
   * @return {Array}            Returns an array of allowable properties
   */
  static get whitelist() {
    return [
      'id',
      'type',
      '_attachments',
      '_etag',
      '_rid',
      '_self',
      '_ts',
      'ttl',
    ];
  }

};

module.exports = Document;
