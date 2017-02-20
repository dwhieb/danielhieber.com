/* eslint-disable no-param-reassign */

const config   = require('./config');
const https    = require('https');
const crypto   = require('crypto');
const markdown = require('markdown-it')();
const qs       = require('querystring');

let token;
const group = '63ed10d0-87d0-30d4-8590-eb5b241df109';

const compare = (a, b) => {
  if (a < b) return -1;
  if (a > b) return +1;
  return 0;
};

const formatDocs = docs => {

  docs.forEach(ref => {
    ref[ref.type] = true;
    if (!ref.year) ref.year = 0;
    if (ref.authors) {
      const last = ref.authors.length - 1;
      ref.sortKey = ref.authors[0].last_name;
      if (ref.authors[last].first_name && ref.authors[last].first_name.endsWith('.')) {
        ref.authors[last].first_name = ref.authors[last].first_name.replace(/\.$/, '');
      }
    }
    if (ref.editors) ref.sortKey = ref.editors[0].last_name;
    if (!('sortKey' in ref)) ref.sortKey = '';
    if (ref.pages) ref.pages = ref.pages.replace('-', '–');
    if (ref.tags && ref.tags.includes('Chitimacha:primary')) ref.primary = true;
    if (ref.tags && ref.tags.includes('Chitimacha:secondary')) ref.secondary = true;
    if (ref.tags && ref.tags.includes('Chitimacha:tertiary')) ref.tertiary = true;
    if (ref.tags && ref.tags.includes('Chitimacha:minor')) ref.minor = true;
    if (ref.notes) ref.notes = markdown.render(ref.notes.replace(/<br\/>/g, '\n'));
  });

  docs.sort((a, b) => {
    return compare(a.sortKey.toLowerCase(), b.sortKey.toLowerCase())
      || compare(a.year, b.year)
      || compare(a.title, b.title);
  });

  docs.forEach(ref => {
    if (ref.year === 0) ref.year = 'n.d.';
    if (!ref.sortKey) ref.sortKey = 'unknown';
  });

  return docs;

};

const getDocs = () => new Promise((resolve, reject) => {

  const opts = {
    headers: { Authorization: `Bearer ${token}` },
    hostname: 'api.mendeley.com',
    path: `/documents?group_id=${group}&limit=500&view=all`,
  };

  const req = https.get(opts, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('error', reject);
    res.on('end', () => {
      const docs = JSON.parse(data);
      resolve(docs);
    });
  });

  req.on('error', reject);

});

const getToken = () => new Promise((resolve, reject) => {

  const opts = {
    auth:     `${config.mendeleyId}:${config.mendeleySecret}`,
    headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
    hostname: 'api.mendeley.com',
    method:   'POST',
    path:     '/oauth/token',
  };

  const body = {
    grant_type: 'client_credentials',
    scope:      'all',
    state:      crypto.randomBytes(20).toString('hex'),
  };

  const req = https.request(opts, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('error', reject);
    res.on('end', () => {
      const tokenData  = JSON.parse(data);
      token = tokenData.access_token;
      resolve();
    });
  });

  req.on('error', reject);
  req.end(qs.stringify(body), 'utf8');

});

const run = () => getToken().then(getDocs).then(formatDocs);

module.exports = { getDocs: run };
