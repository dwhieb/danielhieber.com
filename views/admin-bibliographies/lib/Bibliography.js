/**
 * Model for Bibliography items in the database
 */

class Bibliography {
  constructor({
    description = ``,
    id,
    key = `{ key }`,
    title = `{ New Bibliography }`,
  }) {

    if (id) this.id = id;

    this.description = description;
    this.key         = key;
    this.title       = title;
    this.type        = `bibliography`;

  }
}

module.exports = Bibliography;
