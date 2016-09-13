/* global Collection */

/* eslint-disable
  func-names,
  no-shadow,
  prefer-arrow-callback
*/

describe('Collection', function CollectionSpec() {

  it('new Collection()', function () {
    expect(Collection).toBeDefined();

    const passArray = () => new Collection([]);
    const passNothing = () => new Collection();
    const passObj = () => new Collection({});

    expect(passArray).not.toThrow();
    expect(passNothing).not.toThrow();
    expect(passObj).toThrow();

    const coll = new Collection([]);
    expect(Array.isArray(coll)).toBe(true);
    expect(coll instanceof Collection).toBe(true);
  });

  it('Collection.prototype.add()', function () {
    const coll = new Collection([]);
    expect(coll.add).toBeDefined();
    const len = coll.length;
    coll.add({ hello: 'world' });
    expect(coll.length).toBe(len + 1);
  });

  it('Collection.prototype.remove()', function () {
    const model = { hello: 'world' };
    const coll = new Collection([model]);
    expect(coll.remove).toBeDefined();
    coll.remove(model);
    expect(coll.length).toBe(0);
  });

  it('Collection.prototype.length', function () {
    const models = [
      { hello: 'world' },
      { hello: 'again' },
    ];

    const coll = new Collection(models);
    expect(coll.length).toBe(models.length);

  });

});
