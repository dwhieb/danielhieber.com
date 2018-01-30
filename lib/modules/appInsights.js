const insights = require('applicationinsights');

insights
.setup()
.start();

const trackException = exception => insights.defaultClient.trackException({
  exception,
  properties: {
    exceptionType: `UncaughtException`,
  },
});

process.on(`uncaughtException`, trackException);
