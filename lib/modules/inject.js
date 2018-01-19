/* eslint-disable
  no-param-reassign
*/

const fs            = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

module.exports = async app => {
  app.locals.css = await readFile(`./public/css/main.css`, `utf8`);
};
