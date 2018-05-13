"use strict";

/**
 * Client-side JavaScript for the Bibliographies Editor
 */

/* eslint-env browser */

/* eslint-disable
  no-alert,
*/

var deleteButton = document.getElementById("deleteButton");

var confirmDeletion = function confirmDeletion(ev) {
  var confirmed = confirm("Are you sure you want to delete this bibliography? It will still be available in CosmosDB for 30 days.");
  if (!confirmed) ev.preventDefault();
};

deleteButton.addEventListener("click", confirmDeletion); //# sourceMappingURL=/js/admin-bibliographies.js.map