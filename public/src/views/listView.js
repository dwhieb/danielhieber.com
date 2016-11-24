/* global FormView, Model, View */

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
    return this.collection.length;
  }

  destroy() {
    this.hide();
    this.removeListeners();
    this.nodes.list.innerHTML = '';
  }

  // helper function
  lookupModel(ev) {

    var target = ev.target;

    while (target.tagName !== 'LI') {
      target = target.parentNode;
    }

    const model = this.collection.find(model => Object.is(target.model, model));
    return model || undefined;

  }

  remove(model) {
    this.collection.remove(model);
  }

  removeConfirmed(model) {
    const accepted = confirm('Are you sure you want to delete this item?');
    if (accepted) this.remove(model);
  }

  render() {

    this.hide();
    this.removeListeners();
    this.nodes.list.innerHTML = '';
    this.sort();

    this.collection.forEach(model => {

      const listItem = this.template.content.cloneNode(true);
      const listItemText = model.title
        || model.organization
        || model.location
        || model.name
        || '(No Description)';

      listItem.querySelector('p').textContent = listItemText;
      listItem.querySelector('li').model = model;
      this.nodes.list.appendChild(listItem);

    });

    this.el.view = this;

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
        this.render();
        fv.render();

      } else if (!deadAreas.includes(ev.target.tagName)) {

        // otherwise lookup the model associated with the click event
        const model = this.lookupModel(ev);

        if (model) {

          // if Delete button was clicked, delete the model
          if (ev.target.tagName === 'IMG') {
            this.removeConfirmed(model);

          // otherwise render the form view for that model
          } else {
            const fv = new FormView(model);
            fv.render();
          }

        } else {

          this.render(); // rerender if model was not found

        }

      }

    });

    this.display();
    this.nodes.add.display();
    return this;

  }

  sort() {
    this.collection.sort((a, b) => a.name < b.name);
    return this;
  }

};
