/* global Category, View */

/**
 * Events emitted by CategoriesView
 * @event CategoriesView#add
 * @event CategoriesView#new
 * @event CategoriesView#remove
 * @event CategoriesView#render
 * @event CategoriesView#select
 * @event CategoriesView#sort
 */

/**
 * A class representing the Categories View
 * @type {Object} CategoriesView
 */
const CategoriesView = class CategoriesView extends View {
  /**
   * Create a new CategoriesView
   * @class
   * @param {Array} categories        The array of Category models for the view. Can be an Array or a Collection.
   */
  constructor(categories) {

    const el = document.getElementById('overview');

    super(el, categories);
    this.sort();

    this.nodes = {
      list:        View.bind(document.getElementById('categoriesList')),
      addCategory: View.bind(document.getElementById('addCategoryButton')),
    };

    // Delete the given category from the collection, and rerender view
    const deleteCategory = category => {

      const accepted = confirm('Are you sure you want to delete this category?');

      if (accepted) {
        this.remove(category);
        this.render();
      }

    };

    // Given a click event, lookup the associated category
    const getCategory = ev => {

      var target = ev.target;

      while (target.tagName !== 'LI') {
        target = target.parentNode;
      }

      const category = this.collection.find(category => {
        const symbols = Object.getOwnPropertySymbols(category);
        const match = symbols.some(symbol => category[symbol] === target);
        if (match) return true;
        return false;
      });

      return category || undefined;

    };

    // add a single listener for event delegation
    this.el.addEventListener('click', ev => {
      if (ev.target.tagName !== 'OL' && ev.target.tagName !== 'SECTION') {

        // if the Add Category button is clicked, add a category
        if (ev.target === this.nodes.addCategory) {
          this.emit('new');

        // otherwise lookup the category associated with the click event
        } else {

          const category = getCategory(ev);

          // category was found
          if (category) {

            if (ev.target.tagName === 'IMG') {
              // if Delete button was clicked, delete the category
              deleteCategory(category);
            } else {
              // otherwise emit a 'select' event
              this.emit('select', category);
            }

          // rerender if category was not found
          } else {

            console.error('Category could not be found.');
            this.render();

          }

        }

      }

    });

  }

  add(category) {

    if (!(category instanceof Category)) {
      throw new Error('Category must be an instance of Category.');
    }

    this.collection.add(category);
    this.emit('add', category);
    return this.collection;

  }

  remove(category) {
    this.collection.remove(category);
    this.emit('remove', category);
  }

  render() {

    this.nodes.list.innerHTML = '';

    this.sort();

    this.collection.forEach(category => {

      const li = document.createElement('li');

      const html = `
        <p>${category.name}</p>
        <img src=/img/delete.svg alt='delete this category'>
      `;

      li.innerHTML = html;
      this.nodes.list.appendChild(li);
      category[Symbol('element')] = li; // eslint-disable-line no-param-reassign

    });

    this.emit('render');

    return this;

  }

  sort() {
    this.collection.sort((a, b) => a.name < b.name);
    this.emit('sort', this.collection);
    return this;
  }

};
