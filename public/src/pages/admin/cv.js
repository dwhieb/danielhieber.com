/* global ListView, socket, View */

(function app() {

  let categories = [];
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

  nodes.cvType.addEventListener('change', ev => {

    socket.emit('getAll', ev.target.value, (err, res) => {
      if (err) return displayError(err, 'Error retrieving CV items.');
      if (list) list.destroy();
      list = new ListView(res, ev.target.value);
      list.render();
    });

  });

  nodes.details.addEventListener('submit', ev => ev.preventDefault());

  nodes.addButton.hide();
  nodes.buttons.hide();

  socket.emit('getAll', 'category', (err, res) => {
    if (err) return displayError(err, 'Error retrieving categories.');
    categories = res;
  });

}());
