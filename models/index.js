/* eslint-disable global-require */

module.exports = {
  Award: require('./award'),
  Category: require('./category'),
  Course: require('./course'),
  Document: require('./document'),
  Education: require('./education'),
  Fieldwork: require('./fieldwork'),
  Language: require('./language'),
  Media: require('./media'),
  Membership: require('./membership'),
  Publication: require('./publication'),
  Proficiency: require('./proficiency'),
  Reference: require('./reference'),
  Service: require('./service'),
  Test: require('./test'),
  Work: require('./work'),
};

// also export lowercased versions of models for convenience
for (const model in module.exports) {
  if (module.exports.hasOwnProperty(model)) {
    module.exports[model.toLowerCase()] = module.exports[model];
  }
}
