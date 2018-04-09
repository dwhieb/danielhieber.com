/* eslint-disable
  no-param-reassign,
*/

const { compare }           = require('../../../lib/utilities');
const { CVTypes, pubTypes } = require('../../../lib/constants');

module.exports = docs => {

  // Create CV items hash
  const items = Object.keys(CVTypes)
  .reduce((hash, collType) => {
    if (collType === `categories` || collType === `test`) return hash;
    hash[collType] = docs.filter(doc => doc.type === CVTypes[collType].type && !doc.hidden);
    return hash;
  }, {});

  // Sort CV items as appropriate
  items.awards.sort((a, b) => compare(b.year, a.year));                      // year descending
  items.courses.sort((a, b) => compare(a.title, b.title));                   // title ascending
  items.education.sort((a, b) => compare(b.startYear, a.startYear)           // startYear, endYear descending
    || compare(b.endYear, a.endYear));
  items.fieldwork.sort((a, b) => compare(b.startYear, a.startYear)           // startYear, endYear descending
    || compare(b.endYear, a.endYear));
  items.languages.sort((a, b) => compare(a.title, b.title));                 // title (language name) ascending
  items.media.sort((a, b) => compare(b.date, a.date));                       // date descending
  items.memberships.sort((a, b) => compare(a.organization, b.organization)); // organization ascending
  items.proficiencies.sort((a, b) => compare(a.title, b.title));             // title ascending
  items.publications.sort((a, b) => compare(b.date, a.date)                  // date descending, title ascending
    || compare(a.title, b.title));
  items.references.sort((a, b) => compare(a.priority, b.priority));          // priority ascending
  items.service.sort((a, b) => compare(b.startYear, a.startYear)             // startYear, endYear descending
    || compare(b.endYear, a.endYear));
  items.work.sort((a, b) => compare(b.startYear, a.startYear)                // startYear, endYear descending
    || compare(b.endYear, a.endYear));

  // Create a publications hash
  items.publications = Object.keys(pubTypes)
  .reduce((hash, pubType) => {

    // Create an array for each pubType
    hash[pubType] = items.publications.filter(doc => doc.publicationType === pubType);

    // Add title for rendering
    hash[pubType].title = pubTypes[pubType];

    // Add "year" attribute for rendering
    hash[pubType].forEach(doc => {
      doc.year = new Date(doc.date).getFullYear();
    });

    return hash;
  }, {});

  return items;

};