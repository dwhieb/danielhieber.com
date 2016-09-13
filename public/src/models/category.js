/* global Model */

// the default Category data to use if none is provided
const defaults = {
  id:          '',
  name:        '',
  description: '',
};

/**
 * A class representing a Category
 * @type {Object} Category
 */
const Category = class Category extends Model {
  /**
   * Create a new instance of a Category
   * @type {Object} Category
   * @param {Object} [data]     The JSON data to create the category from
   */
  constructor(data = defaults) {
    super(data);
  }

  /**
   * Delete this category from the database
   * @method
   * @return {Promise} Resolves to a JSON object when the category is deleted
   */
  delete() {
    return new Promise((resolve, reject) => {
      socket.emit('deleteCategory', this, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  /**
   * Save (upsert) this category to the database
   * @method
   * @return {Promise} Resolves to a JSON object when the category is saved
   */
  save() {
    return new Promise((resolve, reject) => {
      socket.emit('updateCategory', this, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

};
