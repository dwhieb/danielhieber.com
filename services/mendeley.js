/**
 * Module for interacting with the Mendeley API
 */

/* eslint-disable
  camelcase,
  func-style,
  no-param-reassign,
  no-use-before-define,
*/

// MODULES

const request     = require('superagent');
const { compare } = require('../utilities');
const { mendeleyID, mendeleySecret } = require('../config');

// VARIABLES

const baseURL = `https://api.mendeley.com`;
const oneHour = 60 * 60 * 1000; // one hour in milliseconds
let access_token;
let expiration = new Date;

// METHODS

/**
 * Retreives an access token from the Mendeley API and saves it
 */
async function authenticate() {

  const res = await request
  .post(`${baseURL}/oauth/token`)
  .auth(mendeleyID, mendeleySecret)
  .type(`form`)
  .send({ grant_type: `client_credentials` })
  .send({ scope: `all` });

  ({ access_token } = res.body);
  expiration = new Date(Date.now() + oneHour);

}

/**
 * Replaces <br> elements with a newline
 * @param  {String} text The text to clean
 * @return {String}
 */
function cleanMarkdown(text) {

  const breakRegExp        = new RegExp(`<br[ /]*>`, `gu`);
  const closeBracketRegExp = new RegExp(`&gt;`, `gu`);
  const openBracketRegExp  = new RegExp(`&lt;`, `gu`);

  return text
  .replace(breakRegExp, `\n`)
  .replace(closeBracketRegExp, `>`)
  .replace(openBracketRegExp, `<`);

}

/**
 * Get all the references for a specific bibliography
 * @param  {String} bibliographyID The Group ID of the bibliography
 * @return {Array}                 Returns an Array of the references
 */
async function getReferences(bibliographyID) {

  if (!isAuthenticated()) await authenticate();

  const params = {
    group_id: bibliographyID,
    limit:    500,
    view:     `all`,
  };

  const res = await request
  .get(`${baseURL}/documents`)
  .set(`Authorization`, `Bearer ${access_token}`)
  .query(params);

  return res.body
  .map(ref => {
    if (ref.abstract) ref.abstract = cleanMarkdown(ref.abstract);
    if (ref.notes) ref.notes = cleanMarkdown(ref.notes);
    return ref;
  })
  .sort((a, b) => compare(a.citation_key, b.citation_key));

}

/**
 * Checks whether the app has been authenticated to the Mendeley API
 * @return {Boolean}
 */
function isAuthenticated() {
  const expired = new Date().getTime() >= expiration.getTime();
  return Boolean(access_token && !expired);
}

module.exports = { getReferences };
