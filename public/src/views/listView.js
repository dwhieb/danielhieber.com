/* global FormView, Model, View */

/**
 * Events emitted by ListView
 */

const ListView = class ListView extends View {
  /**
   * Create a new ListView
   * @param {Array} collection          The collection to use for the list
   * @param {String} type               The type of item displayed in this list
   */
  constructor(collection, type) {

    const el = document.getElementById('overview');
    const template = document.getElementById('listItem-template');

    super(el, template, collection);

    this.sort();

    this.nodes = {
      add:  View.bind(document.getElementById('addButton')),
      list: View.bind(document.getElementById('list')),
    };

    this.type = type || this.collection[0].type;

    if (typeof this.type !== 'string') {
      throw new Error('A "type" attribute is required, either as a parameter to ListView, or as an attribute on the data.');
    }

  }

  add(model) {
    this.collection.add(model);
    this.emit('add', model);
    return this.collection.length;
  }

  destroy() {
    this.hide();
    this.nodes.list.innerHTML = '';
    this.removeListeners();
  }

  // helper function
  lookupModel(ev) {

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

    this.hide();
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

    // add a single listener for event delegation
    this.el.addEventListener('click', ev => {

      const deadAreas = [
        'H1',
        'OL',
        'SECTION',
      ];

      if (ev.target === this.nodes.add) {

        // if the Add button is clicked, add a model
        const model = new Model({ type: this.type });
        const fv = new FormView(model);

        this.collection.add(model);
        fv.render();
        // TODO: add some listeners to the FormView
        // TODO: add new model to listItems (with temporary filler for listed property)
        this.emit('new');

      } else if (!deadAreas.includes(ev.target.tagName)) {

        // otherwise lookup the model associated with the click event
        const model = this.lookupModel(ev);

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

    });

    this.display();
    this.nodes.add.display();
    this.emit('render');
    return this;

  }

  sort() {
    this.collection.sort((a, b) => a.name < b.name);
    this.emit('sort', this.collection);
    return this;
  }

};
