/**
 * GET handler for the Research page
 */

const { getCategories } = require('../lib');

module.exports = async (req, res) => {

  const items = await getCategories();

  items.forEach(cat => {
    // TODO: Remove this when issue #384 is closed
    // eslint-disable-next-line no-param-reassign
    cat.description = cat.markdown;
  });

  res.render(`research`, {
    id:        `research`,
    items,
    pageTitle: `Research`,
    research:  true,
  });

};
