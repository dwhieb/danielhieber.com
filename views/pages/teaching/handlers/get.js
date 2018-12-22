/**
 * GET handler for the Teaching page
 */

const { compare } = require(`../../../../utilities`);
const { db }      = require(`../../../../services`);

module.exports = async (req, res) => {

  const courses = await db.getByType(`course`);

  courses.sort((a, b) => compare(a.title, b.title));

  res.render(`teaching`, {
    courses,
    id:        `teaching`,
    pageTitle: `Teaching`,
    teaching:  true,
  });

};
