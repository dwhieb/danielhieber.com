/**
 * GET handler for the /cv page
 */

/* eslint-disable
  no-return-assign,
*/

const { CVTypes }       = require('../../../constants');
const { getDateString } = require('../../../utilities');

const { createCVItemsHash, getCVItems } = require('../lib');

module.exports = async (req, res) => {

  const docs    = await getCVItems();
  const CVItems = createCVItemsHash(docs);

  const latestTS = docs
  .map(doc => doc._ts * 1000)
  .reduce((latestDate, ts) => (ts >= latestDate ? ts : latestDate));

  const lastUpdated = getDateString(latestTS);

  // Context for the Handlebars template
  const context = {
    cv: true,
    CVItems,
    CVTypes,
    header: false,
    id: `cv`,
    lastUpdated,
    pageTitle: `CV`,
  };

  res.render(`cv`, context);

};
