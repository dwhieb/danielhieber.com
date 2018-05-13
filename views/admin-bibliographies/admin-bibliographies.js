/**
 * Client-side JavaScript for the Bibliographies Editor
 */

/* eslint-env browser */

/* eslint-disable
  no-alert,
*/

const deleteButton = document.getElementById(`deleteButton`);

const confirmDeletion = ev => {
  const confirmed = confirm(`Are you sure you want to delete this bibliography? It will still be available in CosmosDB for 30 days.`);
  if (!confirmed) ev.preventDefault();
};

deleteButton.addEventListener(`click`, confirmDeletion);
