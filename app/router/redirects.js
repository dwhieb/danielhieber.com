/**
 * Router for redirects
 */

const routes = {
  blog:                    `https://blog.danielhieber.com`,
  dlx:                     `https://digitallinguistics.io`,
  dlxBibliography:         `https://digitallinguistics.io/about`,
  flexibilityBibliography: `/bibliographies/lexical-flexibility`,
};

module.exports = {};

Object.entries(routes)
.forEach(([route, url]) => {
  module.exports[route] = (req, res) => res.redirect(url);
});
