/* global FormView, ListView, socket, View */

// TODO: turn authentication back on for Admin subpages
// TODO: turn session middleware back on

(function app() {

  let categories = [];

  const nodes = {
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
      const lv = new ListView(res);
      lv.render();
    });

  });

  socket.emit('getAll', 'category', (err, res) => {
    if (err) return displayError(err, 'Error retrieving categories.');
    categories = res;
  });

}());
