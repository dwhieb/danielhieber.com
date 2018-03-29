"use strict";

// Client-side JavaScript for the admin Editor page

/* eslint-env browser */

/* eslint-disable
  no-alert,
*/

// Elements
var achievementTemplate = document.getElementById("achievement-template");
var achievementsList = document.getElementById("achievements");
var addAchievementButton = document.getElementById("addAchievement");
var addLinkButton = document.getElementById("addLink");
var dateField = document.getElementById("date");
var deleteButton = document.getElementById("delete");
var dropdown = document.getElementById("dropdown");
var endYearField = document.getElementById("endYear");
var forthcomingBox = document.getElementById("forthcoming");
var linksList = document.getElementById("links");
var linkTemplate = document.getElementById("link-template");
var ongoingBox = document.getElementById("ongoing");

// Utilities
var getListItem = function getListItem(node) {
  if (node.tagName === "LI") return node;
  return getListItem(node.parentNode);
};

var isDeleteButton = function isDeleteButton(node) {
  if (node.classList && node.classList.contains("trash")) return true;
  if (node === achievementsList) return false;
  if (node.parentNode) return isDeleteButton(node.parentNode);
  return false;
};

// Handlers
var addAchievement = function addAchievement() {
  var li = achievementTemplate.content.querySelector("li").cloneNode(true);
  achievementsList.appendChild(li);
};

var addLink = function addLink() {
  var li = linkTemplate.content.querySelector("li").cloneNode(true);
  linksList.appendChild(li);
  li.querySelector("input").name = li.querySelector("select").value;
};

var confirmDeletion = function confirmDeletion(_ref) {
  var preventDefault = _ref.preventDefault;


  var confirmed = confirm("Are you sure you want to delete this CV item? It will still be accessible for 30 days in the database if you decide to delete it.");

  if (!confirmed) preventDefault();
};

var deleteAchievement = function deleteAchievement(_ref2) {
  var target = _ref2.target;

  if (!isDeleteButton(target)) return;
  var li = getListItem(target);
  var confirmed = confirm("Are you sure you want to delete this achievement? It cannot be undone.");
  if (confirmed) li.remove();
};

var deleteLink = function deleteLink(_ref3) {
  var target = _ref3.target;

  if (!isDeleteButton(target)) return;
  var li = getListItem(target);
  var confirmed = confirm("Are you sure you want to delete this link? It cannot be undone.");
  if (confirmed) li.remove();
};

var toggleDateField = function toggleDateField() {
  dateField.required = !forthcomingBox.checked;
  dateField.disabled = forthcomingBox.checked;
};

var toggleEndYearField = function toggleEndYearField() {
  endYearField.required = !ongoingBox.checked;
  endYearField.disabled = ongoingBox.checked;
};

var updateLinkType = function updateLinkType(_ref4) {
  var target = _ref4.target;

  var type = target.value;
  var inputField = target.nextElementSibling;
  inputField.name = type;
};

var updateType = function updateType(_ref5) {
  var value = _ref5.target.value;

  window.location = "/admin/" + value;
};

// Attach handlers
dropdown.onchange = updateType;

if (achievementsList) achievementsList.onclick = deleteAchievement;
if (addAchievementButton) addAchievementButton.onclick = addAchievement;
if (addLinkButton) addLinkButton.onclick = addLink;
if (deleteButton) deleteButton.onclick = confirmDeletion;
if (forthcomingBox) forthcomingBox.onchange = toggleDateField;
if (ongoingBox) ongoingBox.onchange = toggleEndYearField;

if (linksList) {
  linksList.onclick = deleteLink;
  linksList.onchange = updateLinkType;
} //# sourceMappingURL=/js/editor.js.map