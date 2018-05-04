/**
 * GET handler for the Research page
 */

const { getCategories } = require('../lib');

module.exports = async (req, res) => {

  const categories = await getCategories();

  categories.forEach(cat => {
    // TODO: Remove this when issue #384 is closed
    // eslint-disable-next-line no-param-reassign
    cat.description = cat.markdown;
  });

  res.render(`research`, {
    categories,
    id:        `research`,
    pageTitle: `Research`,
    research:  true,
  });

};
