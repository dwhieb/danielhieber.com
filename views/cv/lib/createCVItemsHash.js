const { compare }    = require('../../../lib/utilities');
const { CVTypes }    = require('../../../lib/constants');

module.exports = docs => {

  const items = {};

  Object.keys(CVTypes)
  .forEach(type => {
    if (type === `categories` || type === `test`) return;
    items[type] = docs.filter(doc => doc.type === CVTypes[type]);
  });

  // Sort CV items as appropriate
  items.awards.sort((a, b) => compare(b.year, a.year));                      // year descending
  items.courses.sort((a, b) => compare(a.title, b.title));                   // title ascending
  items.education.sort((a, b) => compare(b.startYear, a.startYear));         // startYear descending
  items.fieldwork.sort((a, b) => compare(b.startYear, a.startYear));         // startYear descending
  items.languages.sort((a, b) => compare(a.title, b.title));                 // title (language name) ascending
  items.media.sort((a, b) => compare(b.date, a.date));                       // date descending
  items.memberships.sort((a, b) => compare(a.organization, b.organization)); // organization ascending
  items.proficiencies.sort((a, b) => compare(a.title, b.title));             // title ascending
  items.publications.sort((a, b) => compare(b.date, a.date));                // date descending
  items.references.sort((a, b) => compare(a.priority, b.priority));          // priority ascending
  items.service.sort((a, b) => compare(b.startYear, a.startYear));           // startYear descending
  items.work.sort((a, b) => compare(b.startYear, a.startYear));              // startYear descending

  return items;

};
