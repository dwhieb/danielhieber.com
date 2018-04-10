/* eslint-disable
  no-return-assign,
*/

const { createCVItemsHash, getCVItems } = require('./lib');

module.exports = async (req, res) => {

  const docs    = await getCVItems();
  const CVItems = createCVItemsHash(docs);

  // Context for the Handlebars template
  const context = {
    cv:        true,
    CVItems,
    header:    false,
    pageTitle: `CV`,
  };

  res.render(`cv`, context);

};
