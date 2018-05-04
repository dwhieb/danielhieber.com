/**
 * A list of the types of CV items in their plural form, with a human-readable heaader, id, and singular form.
 * NB: The order of the keys here determines the orde that items are listed in the CV page Contents section
 */

module.exports = {
  categories: {
    header: `Categories`,
    id:     `categories`,
    type:   `category`,
  },
  education: {
    header: `Education`,
    id:     `education`,
    type:   `education`,
  },
  work: {
    header: `Professional Experience`,
    id:     `work`,
    type:   `work`,
  },
  courses: {
    header: `Teaching`,
    id:     `teaching`,
    type:   `course`,
  },
  awards: {
    header: `Awards & Honors`,
    id:     `awards`,
    type:   `award`,
  },
  publications: {
    header: `Publications & Presentations`,
    id:     `publications`,
    type:   `publication`,
  },
  service: {
    header: `Service`,
    id:     `service`,
    type:   `service`,
  },
  memberships: {
    header: `Professional Memberships`,
    id:     `memberships`,
    type:   `membership`,
  },
  fieldwork: {
    header: `Fieldwork & Descriptive Work`,
    id:     `fieldwork`,
    type:   `fieldwork`,
  },
  languages: {
    header: `Languages Spoken & Studied`,
    id:     `languages`,
    type:   `language`,
  },
  proficiencies: {
    header: `Skills & Proficiencies`,
    id:     `proficiencies`,
    type:   `proficiency`,
  },
  media: {
    header: `Media About Me`,
    id:     `media`,
    type:   `media`,
  },
  references: {
    header: `Professional References`,
    id:     `references`,
    type:   `reference`,
  },
};
