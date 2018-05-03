/**
 * Server configuration and initialization
 * @type {[type]}
 */

/* eslint-disable
  no-console,
*/

const { appInsights } = require('../../services');
const config          = require('../../config');
const http            = require('http');
const meta            = require('../../package.json');

module.exports = function startServer(app) {

  const server = http.createServer(app);

  server.on(`error`, err => appInsights.handleError(err));

  server.listen(config.port, () => {
    console.log(`Server started. Press Ctrl+C to terminate.
    Project: ${meta.name}
    Port:    ${config.port}
    Time:    ${new Date}
    Node:    ${process.version}
    Env:     ${config.env}`);
  });

  process.on(`SIGTERM`, () => {
    console.log(`Shutting down process.`);
    server.stop();
  });

  return server;

};
