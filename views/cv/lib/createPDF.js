const { baseURL } = require('../../../lib/config');
const path        = require('path');
const prince      = require('prince');

const princePath = path.join(process.cwd(), `node_modules/prince/prince.exe`);

module.exports = async () => {

  try {

    const { stdout, stderr } = await prince()
    .binary(princePath)
    .option(`baseurl`, `${baseURL}/cv`)
    // .option(`no-warn-css`, true, true)
    // .option(`media`, `print`)
    // .option(`page-size`, `letter`, true)
    // .option(`page-margin`, `1in`, true)
    // .option(`pdf-title`, `Daniel W. Hieber - Curriculum Vitae`)
    // .option(`pdf-author`, `Daniel W. Hieber`)
    .inputs(`${baseURL}/cv`)
    .output(path.join(__dirname, `../cv.pdf`))
    .execute();

    // eslint-disable-next-line no-console
    if (stdout.length) console.log(stdout.toString(`utf8`));
    if (stderr.length) console.error(stderr.toString(`utf8`));

  } catch (e) {

    console.error(e.error);
    throw e;

  }

};
