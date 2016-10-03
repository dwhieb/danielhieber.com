/* eslint-disable global-require */

module.exports = {
  Award: require('./award'),
  Category: require('./category'),
  Document: require('./document'),
  Education: require('./education'),
  Fieldwork: require('./fieldwork'),
  Langauge: require('./language'),
  Media: require('./media'),
  Membership: require('./membership'),
  Publication: require('./publication'),
  Proficiency: require('./proficiency'),
  Reference: require('./reference'),
  Service: require('./service'),
  Work: require('./work'),
};

// also export lowercased versions of models for convenience
for (const model in module.exports) {
  if (module.exports.hasOwnProperty(model)) {
    module.exports[model.toLowerCase()] = module.exports[model];
  }
}
