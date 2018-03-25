/* eslint-env browser */

const dropdown = document.getElementById(`dropdown`);

const updateType = ev => {
  window.location = `/admin/${ev.target.value}`;
};

dropdown.onchange = updateType;
