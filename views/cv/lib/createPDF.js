const { baseURL } = require('../../../lib/config');
const path        = require('path');
const prince      = require('prince');

module.exports = async () => {

  try {

    console.log('About to start Prince');

    const { stdout, stderr } = await prince()
    .option(`baseurl`, `${baseURL}/cv`)
    .option(`no-warn-css`, true, true)
    .option(`media`, `print`)
    .option(`page-size`, `letter`, true)
    .option(`page-margin`, `1in`, true)
    .option(`pdf-title`, `Daniel W. Hieber - Curriculum Vitae`)
    .option(`pdf-author`, `Daniel W. Hieber`)
    .inputs(`${baseURL}/cv`)
    .output(path.join(__dirname, `../cv.pdf`))
    .execute();

    console.log(`Info:`, stdout.toString(`utf8`));
    console.error(`Errors:`, stderr.toString(`utf8`));

    // eslint-disable-next-line no-console
    if (stdout.length) console.log(stdout.toString(`utf8`));
    if (stderr.length) console.error(stderr.toString(`utf8`));

  } catch (e) {

    console.error(`Got a Prince error`);
    console.error(e);

    throw e.error;

  }

};
