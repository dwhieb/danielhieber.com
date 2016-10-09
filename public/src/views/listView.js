/* global View */

/**
 * Events emitted by ListView
 */

const ListView = class ListView extends View {
  /**
   * Create a new ListView
   * @param {Array} collection          The collection to use for the list
   */
  constructor(collection) {

    const el = document.getElementById('overview');
    const template = document.getElementById('listItem-template');

    super(el, template, collection);

    this.sort();

    this.nodes = {
      add:  View.bind(document.getElementById('addButton')),
      list: View.bind(document.getElementById('list')),
    };

    // helper function
    const lookupModel = ev => {

      var target = ev.target;

      while (target.tagName !== 'LI') {
        target = target.parentNode;
      }

      const model = this.collection.find(model => {
        const symbols = Object.getOwnPropertySymbols(model);
        const match = symbols.some(symbol => model[symbol] === target);
        if (match) return true;
        return false;
      });

      return model || undefined;

    };

    // add a single listener for event delegation
    this.el.addEventListener('click', ev => {

      if (ev.target.tagName !== 'OL' && ev.target.tagName !== 'SECTION') {

        if (ev.target === this.nodes.add) {

          // if the Add button is clicked, add a model
          this.emit('new');

        } else {

          // otherwise lookup the model associated with the click event
          const model = lookupModel(ev);

          // model was found
          if (model) {

            if (ev.target.tagName === 'IMG') {
              // if Delete button was clicked, delete the model
              this.removeConfirmed(model);
            } else {
              // otherwise emit a 'select' event
              this.emit('select', model);
            }

          // rerender if model was not found
          } else {

            console.error('Model could not be found.');
            this.render();

          }

        }

      }

    });

  }

  add(model) {
    this.collection.add(model);
    this.emit('add', model);
    return this.collection.length;
  }

  remove(model) {
    this.collection.remove(model);
    this.emit('remove', model);
  }

  removeConfirmed(model) {
    const accepted = confirm('Are you sure you want to delete this item?');
    if (accepted) this.remove(model);
  }

  render() {

    this.nodes.list.innerHTML = '';
    this.sort();

    this.collection.forEach(model => {

      const listItem = this.template.content.cloneNode(true);

      const listItemText = model.title
        || model.organization
        || model.location
        || model.name;

      listItem.querySelector('p').textContent = listItemText;
      this.nodes.list.appendChild(listItem);
      model[Symbol('element')] = listItem; // eslint-disable-line no-param-reassign
      this.el.model = this;

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
