/**
 * GET handler for the Research page
 */

const { compare } = require(`../../../../utilities`);
const { db }      = require(`../../../../services`);

module.exports = async (req, res) => {

  const items = await db.getByType(`category`);

  items
  .sort((a, b) => compare(a.priority, b.priority))
  .forEach(cat => {
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
