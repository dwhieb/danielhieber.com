const { createPDF } = require('../lib');
const path          = require('path');
const { promisify } = require('util');

module.exports = async (req, res, next) => {

  await createPDF();

  const sendFile = await promisify(res.sendFile).bind(res);

  try {
    await sendFile(path.join(__dirname, `../cv.pdf`));
  } catch (e) {
    return next(e);
  }

};
