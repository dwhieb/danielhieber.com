const { createPDF } = require('../lib');
const path          = require('path');
const { promisify } = require('util');

module.exports = async (req, res, next) => {

  console.log('Script got to handler');

  await createPDF();

  console.log('Script created PDF');

  const sendFile = await promisify(res.sendFile).bind(res);

  try {
    await sendFile(path.join(__dirname, `../cv.pdf`));
  } catch (e) {
    console.log('Script got an error');
    console.error(e);
    return next(e);
  }

};
