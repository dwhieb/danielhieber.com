/**
 * Model for Bibliography items in the database
 */

class Bibliography {
  constructor({
    description = ``,
    id,
    key = `{ key }`,
    mendeleyID = ``,
    title = `{ New Bibliography }`,
  }) {

    if (id) this.id = id;

    this.description = description;
    this.key         = key.toLowerCase();
    this.mendeleyID  = mendeleyID;
    this.title       = title;
    this.type        = `bibliography`;

  }
}

module.exports = Bibliography;
