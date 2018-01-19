/* eslint-disable
  no-param-reassign
*/

const { icons }     = require('feather-icons');
const fs            = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const myIcons = {
  bookOpen:      icons[`book-open`].toSvg({ 'aria-hidden': true }),
  code:          icons.code.toSvg({ 'aria-hidden': true }),
  edit:          icons.edit.toSvg({ 'aria-hidden': true }),
  fileText:      icons[`file-text`].toSvg({ 'aria-hidden': true }),
  heart:         icons.heart.toSvg({ 'aria-hidden': true }),
  home:          icons.home.toSvg({ 'aria-hidden': true }),
  list:          icons.list.toSvg({ 'aria-hidden': true }),
  messageCircle: icons[`message-circle`].toSvg({ 'aria-hidden': true }),
  users:         icons.users.toSvg({ 'aria-hidden': true }),
};

module.exports = async app => {
  app.locals.css   = await readFile(`./public/css/main.css`, `utf8`);
  app.locals.icons = myIcons;
};
