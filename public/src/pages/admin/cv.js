/* global app, ListView, socket, View */

window.app = {

  nodes: {
    addButton: View.bind(document.getElementById('addButton')),
    buttons:   View.bind(document.getElementById('buttons')),
    cvType:    View.bind(document.getElementById('cv-type')),
    details:   View.bind(document.getElementById('details')),
    form:      View.bind(document.getElementById('form')),
    overview:  View.bind(document.getElementById('overview')),
  },

  categories: [],
  collection: [],
  form:       null,
  list:       null,
  templates:  document.querySelectorAll('#templates template'),

  displayError(err, message) {
    View.hide(this.nodes.buttons);
    this.nodes.form.innerHTML = `
      <h1>${message || err.message}</h1>
      <code>${JSON.stringify(err, null, 2).replace(/\\/g, '')}</code>
    `;
  },

  getTemplate(prop) {
    return document.getElementById(`${prop}-template`);
  },

  refreshCategories() {
    socket.emit('getAll', 'category', (err, res) => {
      if (err) this.displayError(err, 'Error retrieving categories');
      this.categories = res;
    });
  },

  refreshList(type) {
    socket.emit('getAll', type, (err, res) => {
      this.nodes.details.hide();
      if (err) this.displayError(err, 'Error retrieving CV items.');
      if (this.list) this.list.destroy();
      this.list = new ListView(res, type);
      this.collection = this.list.collection;
      this.collection.sort((a, b) => a.title > b.title);
      this.list.render();
    });
  },

  removeModel(model) {
    model.destroy()
    .then(() => {
      this.form.destroy();
      const i = this.collection.indexOf(model);
      if (i >= 0) this.collection.splice(i, 1);
      this.list.render();
    })
    .catch(err => this.displayError(err));
  },

};

app.nodes.addButton.hide();
app.nodes.details.hide();
app.refreshCategories();

// add event listeners
app.nodes.cvType.addEventListener('change', ev => app.refreshList(ev.target.value));
app.nodes.form.addEventListener('submit', ev => ev.preventDefault());
