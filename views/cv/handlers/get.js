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

  // Get latest timestamp
  const latestTS = docs
  .reduce((latest, { _ts }) => (_ts >= latest ? _ts : latest), 0);

  // Get date string from latest timestamp
  const lastUpdated = getDateString(latestTS * 1000);

  // Context for the Handlebars template
  const context = {
    cv:          true,
    CVItems,
    CVTypes,
    header:      false,
    id:          `cv`,
    lastUpdated,
    pageTitle:   `CV`,
  };

  res.render(`cv`, context);

};
