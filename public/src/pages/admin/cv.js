/* global ListView, socket, View */

window.app = (function cv() {

  const app = {};
  let list;

  const nodes = {
    addButton: View.bind(document.getElementById('addButton')),
    buttons:   View.bind(document.getElementById('buttons')),
    cvType:    View.bind(document.getElementById('cv-type')),
    details:   View.bind(document.getElementById('details')),
    formItems: View.bind(document.getElementById('formItems')),
    overview:  View.bind(document.getElementById('overview')),
  };

  const displayError = (err, message) => {
    View.hide(nodes.buttons);
    nodes.formItems.innerHTML = `
      <h1>${message}</h1>
      <code>${JSON.stringify(err, null, 2).replace(/\\/g, '')}</code>
    `;
  };

  nodes.addButton.hide();
  nodes.details.hide();

  nodes.cvType.addEventListener('change', ev => {

    socket.emit('getAll', ev.target.value, (err, res) => {
      if (err) return displayError(err, 'Error retrieving CV items.');
      nodes.details.hide();
      if (list) list.destroy();
      list = new ListView(res, ev.target.value);
      list.on('new', nodes.details.display);
      list.render();
    });

  });

  nodes.details.addEventListener('submit', ev => ev.preventDefault());

  socket.emit('getAll', 'category', (err, res) => {
    if (err) return displayError(err, 'Error retrieving categories.');
    app.categories = res;
  });

  return app;

}());
