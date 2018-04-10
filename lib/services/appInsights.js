const insights = require('applicationinsights');

module.exports = () => {

  insights
  .setup()
  .start();

  const trackException = exception => insights.defaultClient.trackException({
    exception,
    properties: {
      data:          exception.data,
      exceptionType: `UncaughtException`,
      headers:       exception.output.headers,
    },
  });

  process.on(`uncaughtException`, trackException);

};
