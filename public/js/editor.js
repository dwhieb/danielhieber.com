"use strict";

// Client-side JavaScript for the admin Editor page

/* eslint-env browser */

/* eslint-disable
  no-alert,
*/

// Elements
var achievementTemplate = document.getElementById("achievement-template");
var achievementsList = document.querySelector(".achievements ul");
var addAchievementButton = document.getElementById("addAchievementButton");
var dropdown = document.getElementById("dropdown");

// Handlers
var addAchievement = function addAchievement() {
  var li = achievementTemplate.content.querySelector("li").cloneNode(true);
  achievementsList.appendChild(li);
};

var deleteAchievement = function deleteAchievement(ev) {

  var isButton = function isButton(node) {
    if (node.classList.contains("trash")) return true;
    if (node === achievementsList) return false;
    if (node.parentNode) return isButton(node.parentNode);
    return false;
  };

  var getListItem = function getListItem(node) {
    if (node.tagName === "LI") return node;
    return getListItem(node.parentNode);
  };

  if (!isButton(ev.target)) return;

  var li = getListItem(ev.target);

  var confirmed = confirm("Are you sure you want to delete this achievement?");

  if (confirmed) li.remove();
};

var updateType = function updateType(ev) {
  window.location = "/admin/" + ev.target.value;
};

// Attach handlers
dropdown.onchange = updateType;

if (achievementsList) achievementsList.addEventListener("click", deleteAchievement);
if (addAchievementButton) addAchievementButton.onclick = addAchievement; //# sourceMappingURL=/js/editor.js.map