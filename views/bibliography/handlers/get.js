const { db, mendeley } = require('../../../services');

module.exports = async (req, res) => {

  const bibliography = await db.getByKey(req.params.bibliography);
  const references   = await mendeley.getReferences(bibliography.mendeleyID);

  res.render(`bibliography`, {
    bibliographies: true,
    bibliography,
    id:             `bibliography`,
    pageTitle:      `${bibliography.title}: A bibliography`,
    references,
  });

};
