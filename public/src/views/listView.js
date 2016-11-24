/* global app, FormView, Model, View */

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

  // adds a model to the collection (data only)
  add(model) {
    this.collection.add(model);
    return this.collection.length;
  }

  // destroys this view, removing all listeners
  destroy() {
    this.hide();
    this.removeListeners();
    this.nodes.list.innerHTML = '';
  }

  // looks up the model based on a click event in the list
  lookupModel(ev) {

    var target = ev.target;

    while (target.tagName !== 'LI') {
      target = target.parentNode;
    }

    const model = this.collection.find(model => Object.is(target.model, model));
    return model || undefined;

  }

  // removes a model from the collection (data only)
  remove(model) {
    this.collection.remove(model);
  }

  // confirms that the user wants to remove a model from the collection (data only)
  removeConfirmed(model) {
    const accepted = confirm('Are you sure you want to delete this item?');
    if (accepted) this.remove(model);
  }

  // renders the view, removing any existing listeners first
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
        app.model = new Model({ type: this.type });
        this.collection.add(app.model);
        this.render();
        app.form = new FormView(app.model);
        app.form.render();

      } else if (!deadAreas.includes(ev.target.tagName)) {

        // otherwise lookup the model associated with the click event
        const model = this.lookupModel(ev);

        if (model) {

          if (ev.target.tagName === 'IMG') {
            // if Delete button was clicked, delete the model
            this.removeConfirmed(model);
            model.destroy();
            app.form.destroy();
            this.render();
          } else {
            // otherwise render the form view for that model
            app.model = model;
            app.form = new FormView(model);
            app.form.render();
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

  // sorts the collection (data only)
  sort() {
    return this;
  }

};
