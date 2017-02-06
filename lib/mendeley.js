const config = require('./config');
const https  = require('https');
const crypto = require('crypto');
const qs     = require('querystring');

let token;
const group = '63ed10d0-87d0-30d4-8590-eb5b241df109';

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
  res.on('error', console.error);
  res.on('end', () => {
    data  = JSON.parse(data);
    token = data.access_token;

  });

});

req.on('error', console.error);

req.end(qs.stringify(body), 'utf8');

const getDocs = () => new Promise((resolve, reject) => {

  const opts = {
    headers: { Authorization: `Bearer ${token}` },
    hostname: 'api.mendeley.com',
    path: `/documents?group_id=${group}&limit=500`,
  };

  const request = https.get(opts, res => {

    let data = '';

    res.on('data', chunk => { data += chunk; });
    res.on('error', reject);
    res.on('end', () => {
      data = JSON.parse(data);
      resolve(data);
    });

  });

  request.on('error', reject);

});

module.exports = { getDocs };
