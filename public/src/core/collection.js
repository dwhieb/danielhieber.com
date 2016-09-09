const Collection = class Collection extends Array {
  constructor(data) {

    if (Number.isInteger(data)) {
      super(data);
    } else if (!Array.isArray(data)) {
      throw new Error('Collection data must be an array.');
    } else {
      super(...data);
    }

  }

  add(model) {
    this.push(model);
  }

  remove(model) {
    const i = this.findIndex(el => Object.is(model, el));
    this.splice(i, 1);
  }

};
