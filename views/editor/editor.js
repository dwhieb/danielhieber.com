/* eslint-env browser */
const dropdown = document.getElementById(`dropdown`);
dropdown.onchange = ev => { window.location = `/admin/${ev.target.value}`; };
