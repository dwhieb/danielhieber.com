/* eslint-disable
  no-console
*/

const config   = require('../config');
const http     = require('http');
const insights = require('applicationinsights');
const meta     = require('../../package.json');

module.exports = function startServer(app) {

  const server = http.createServer(app);

  server.on(`error`, exception => {

    console.error(exception, exception.stack);

    insights.defaultClient.trackException({
      exception,
      properties: {
        exceptionType: `ServerException`,
      },
    });

  });

  server.listen(config.port, () => {
    console.log(`Server started. Press Ctrl+C to terminate.
    Project: ${meta.name}
    Port:    ${config.port}
    Time:    ${new Date}
    Node:    ${process.version}
    Env:     ${config.env}`);
  });

  return server;

};
