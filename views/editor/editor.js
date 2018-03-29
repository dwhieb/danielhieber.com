// Client-side JavaScript for the admin Editor page

/* eslint-env browser */

/* eslint-disable
  no-alert,
*/

// Elements
const achievementTemplate  = document.getElementById(`achievement-template`);
const achievementsList     = document.querySelector(`.achievements ul`);
const addAchievementButton = document.getElementById(`addAchievement`);
const dateField            = document.getElementById(`date`);
const deleteButton         = document.getElementById(`delete`);
const dropdown             = document.getElementById(`dropdown`);
const endYearField         = document.getElementById(`endYear`);
const forthcomingBox       = document.getElementById(`forthcoming`);
const ongoingBox           = document.getElementById(`ongoing`);

// Handlers
const addAchievement = () => {
  const li = achievementTemplate.content.querySelector(`li`).cloneNode(true);
  achievementsList.appendChild(li);
};

const confirmDeletion = ev => {

  const confirmed = confirm(`Are you sure you want to delete this CV item? It will still be accessible for 30 days in the database if you decide to delete it.`);

  if (!confirmed) ev.preventDefault();

};

const deleteAchievement = ev => {

  const isButton = node => {
    if (node.classList.contains(`trash`)) return true;
    if (node === achievementsList) return false;
    if (node.parentNode) return isButton(node.parentNode);
    return false;
  };

  const getListItem = node => {
    if (node.tagName === `LI`) return node;
    return getListItem(node.parentNode);
  };

  if (!isButton(ev.target)) return;

  const li = getListItem(ev.target);

  const confirmed = confirm(`Are you sure you want to delete this achievement?`);

  if (confirmed) li.remove();

};

const toggleDateField = () => {
  dateField.required = !forthcomingBox.checked;
  dateField.disabled = forthcomingBox.checked;
};

const toggleEndYearField = () => {
  endYearField.required = !ongoingBox.checked;
  endYearField.disabled = ongoingBox.checked;
};

const updateType = ev => {
  window.location = `/admin/${ev.target.value}`;
};

// Attach handlers
dropdown.onchange = updateType;

if (achievementsList) achievementsList.onclick = deleteAchievement;
if (addAchievementButton) addAchievementButton.onclick = addAchievement;
if (deleteButton) deleteButton.onclick = confirmDeletion;
if (forthcomingBox) forthcomingBox.onchange = toggleDateField;
if (ongoingBox) ongoingBox.onchange = toggleEndYearField;
