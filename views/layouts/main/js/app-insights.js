/**
 * Azure's client-side Application Insights
 * NB: This may need to be updated periodically as new versions of AppInsights are released
 */

/* eslint-disable */

if (navigator.onLine) {

  // Setup Application Insights
  var appInsights = window.appInsights || function(a) {
    function b(a) {
      c[a] = function() {
        var b = arguments;
        c.queue.push(function() {
          c[a].apply(c, b)
        })
      }
    }
    var c = {
        config: a
      },
      d = document,
      e = window;
    setTimeout(function() {
      var b = d.createElement("script");
      b.src = a.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js", d.getElementsByTagName("script")[0].parentNode.appendChild(b)
    });
    try {
      c.cookie = d.cookie
    } catch (a) {}
    c.queue = [];
    for (var f = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; f.length;) b("track" + f.pop());
    if (b("setAuthenticatedUserContext"), b("clearAuthenticatedUserContext"), b("startTrackEvent"), b("stopTrackEvent"), b("startTrackPage"), b("stopTrackPage"), b("flush"), !a.disableExceptionTracking) {
      f = "onerror", b("_" + f);
      var g = e[f];
      e[f] = function(a, b, d, e, h) {
        var i = g && g(a, b, d, e, h);
        return !0 !== i && c["_" + f](a, b, d, e, h), i
      }
    }
    return c
  }({
    instrumentationKey: "62a955a6-e0a8-4317-9dd5-cb1b6c4150c8"
  });

  // Start Application Insights
  window.appInsights = appInsights, appInsights.queue && 0 === appInsights.queue.length && appInsights.trackPageView();

  // Track download counts / views of publications (any link with a data-track=true attribute)
  document.body.addEventListener(`click`, ({ target }) => {
    if (target.dataset.track) appInsights.trackEvent(target.dataset.track);
  });

}