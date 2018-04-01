/**
 * Route handler to add a new file to a document`
 * @name postFile.js
 */

module.exports = async (req, res, next) => {

  if (!req.file.size) return res.error.badRequest(`Please select a file to upload.`);

  console.log(req.body);
  console.log(req.file);

  res.redirect(req.originalUrl);

};
