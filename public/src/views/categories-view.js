/* global Model, View */

const CategoriesView = class CategoriesView extends View {
  constructor(categories) {

    const el = document.getElementById('overview');

    super(el, categories);
    this.sort();

    this.nodes = {
      list:        View.bind(document.getElementById('categoriesList')),
      addCategory: View.bind(document.getElementById('addCategoryButton')),
    };

    // delegated event listener
    this.el.addEventListener('click', ev => {
      if (ev.target.tagName !== 'OL' && ev.target.tagName !== 'SECTION') {

        if (ev.target === this.nodes.addCategory) {

          const category = new Model({
            name:        '{Category Name}',
            id:          '{ID}',
            description: '{Category Description}',
          });

          this.add(category);
          this.sort();
          this.render();

        } else {

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

          if (category) {

            if (ev.tagName === 'IMG') {
              const accepted = confirm('Are you sure you want to delete this category?');
              if (accepted) {
                this.remove(category);
                this.render();
              }
            } else {
              this.emit('select', category);
            }

          } else {

            throw new Error('Category could not be found.');

          }

        }

      }

    });

  }

  add(category) {

    if (!(category instanceof Model)) throw new Error('Category must be an instance of Model.');

    this.collection.add(category);
    this.emit('add', category);
    return this.collection;

  }

  remove(category) {

    const i = this.collection.findIndex(item => Object.is(item, category) || item.id === category);

    if (i) {
      const category = this.collection.splice(i, 1);
      category.delete().then(() => this.emit('remove', category));
      return this.collection;
    }

    throw new Error('Could not find category.');

  }

  render() {

    this.nodes.list.innerHTML = '';

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
    this.collection.sort((a, b) => a.name > b.name);
    this.emit('sort', this.collection);
    return this;
  }

};
