/**
 * Client-side JavaScript for the CV Editor page
 */

/* eslint-env browser */

/* eslint-disable
  no-alert,
*/

// Elements
const achievementTemplate  = document.getElementById(`achievement-template`);
const achievementsList     = document.getElementById(`achievements`);
const addAchievementButton = document.getElementById(`addAchievement`);
const addLinkButton        = document.getElementById(`addLink`);
const dateField            = document.getElementById(`date`);
const deleteButton         = document.getElementById(`delete`);
const dropdown             = document.getElementById(`dropdown`);
const endYearField         = document.getElementById(`endYear`);
const filesList            = document.getElementById(`files`);
const fileUpload           = document.getElementById(`fileUpload`);
const forthcomingBox       = document.getElementById(`forthcoming`);
const linksList            = document.getElementById(`links`);
const linkTemplate         = document.getElementById(`link-template`);
const ongoingBox           = document.getElementById(`ongoing`);
const uploadFileButton     = document.getElementById(`uploadFileButton`);

// Utilities
const getListItem = node => {
  if (node.tagName === `LI`) return node;
  return getListItem(node.parentNode);
};

const isDeleteButton = node => {
  if (node.classList && node.classList.contains(`trash`)) return true;
  if (node.parentNode) return isDeleteButton(node.parentNode);
  return false;
};

// Handlers
const addAchievement = () => {
  const li = achievementTemplate.content.querySelector(`li`).cloneNode(true);
  achievementsList.appendChild(li);
};

const addLink = () => {
  const li = linkTemplate.content.querySelector(`li`).cloneNode(true);
  linksList.appendChild(li);
  li.querySelector(`input`).name = li.querySelector(`select`).value;
};

const confirmDeletion = ({ preventDefault }) => {

  const confirmed = confirm(`Are you sure you want to delete this CV item? It will still be accessible for 30 days in the database if you decide to delete it.`);

  if (!confirmed) preventDefault();

};

// NB: Cannot use destructuring with preventDefault for some reason
const confirmFileDeletion = ev => {
  if (!isDeleteButton(ev.target)) return;
  const confirmed = confirm(`Are you sure you want to delete this file? This cannot be undone.`);
  if (!confirmed) ev.preventDefault();
};

const deleteAchievement = ({ target }) => {
  if (!isDeleteButton(target)) return;
  const li = getListItem(target);
  const confirmed = confirm(`Are you sure you want to delete this achievement? This cannot be undone.`);
  if (confirmed) li.remove();
};

const deleteLink = ({ target }) => {
  if (!isDeleteButton(target)) return;
  const li = getListItem(target);
  const confirmed = confirm(`Are you sure you want to delete this link? This cannot be undone.`);
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

const updateLinkType = ({ target }) => {
  const type       = target.value;
  const inputField = target.nextElementSibling;
  inputField.name  = type;
};

const updateType = ({ target: { value } }) => {
  window.location = `/admin/${value}`;
};

const validateFile = ({ preventDefault }) => {
  if (!fileUpload.files.length) {
    fileUpload.setCustomValidity(`Please select a file to upload.`);
    preventDefault();
  }
};

// Attach handlers
dropdown.onchange = updateType;

if (achievementsList) achievementsList.onclick = deleteAchievement;
if (addAchievementButton) addAchievementButton.onclick = addAchievement;
if (addLinkButton) addLinkButton.onclick = addLink;
if (deleteButton) deleteButton.onclick = confirmDeletion;
if (filesList) filesList.onclick = confirmFileDeletion;
if (forthcomingBox) forthcomingBox.onchange = toggleDateField;
if (ongoingBox) ongoingBox.onchange = toggleEndYearField;
if (uploadFileButton) uploadFileButton.onclick = validateFile;

if (linksList) {
  linksList.onclick  = deleteLink;
  linksList.onchange = updateLinkType;
}
