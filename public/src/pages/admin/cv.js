/* global app, ListView, socket, View */

window.app = {

  nodes: {
    addButton: View.bind(document.getElementById('addButton')),
    buttons:   View.bind(document.getElementById('buttons')),
    cvType:    View.bind(document.getElementById('cv-type')),
    details:   View.bind(document.getElementById('details')),
    formItems: View.bind(document.getElementById('formItems')),
    overview:  View.bind(document.getElementById('overview')),
  },

  categories: [],
  collection: [],
  form:       null,
  list:       null,

  displayError(err, message) {
    View.hide(this.nodes.buttons);
    this.nodes.formItems.innerHTML = `
      <h1>${message}</h1>
      <code>${JSON.stringify(err, null, 2).replace(/\\/g, '')}</code>
    `;
  },

  refreshCategories() {
    socket.emit('getAll', 'category', (err, res) => {
      if (err) this.displayError(err, 'Error retrieving categories');
      this.categories = res;
    });
  },

  refreshList(type) {
    socket.emit('getAll', type, (err, res) => {
      if (err) this.displayError(err, 'Error retrieving CV items.');
      this.nodes.details.hide();
      if (this.list) this.list.destroy();
      this.list = new ListView(res, type);
      this.collection = this.list.collection;
      this.list.render();
    });
  },

};

app.nodes.addButton.hide();
app.nodes.details.hide();
app.refreshCategories();

// add event listeners
app.nodes.cvType.addEventListener('change', ev => app.refreshList(ev.target.value));
app.nodes.formItems.addEventListener('submit', ev => ev.preventDefault());
