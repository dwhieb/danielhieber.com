/* global Collection */

/* eslint-disable
  func-names,
  no-shadow,
  prefer-arrow-callback
*/

describe('Collection', function CollectionSpec() {

  it('adds Collection to the global scope', function exists() {
    expect(Collection).toBeDefined();
  });

  it('is an instance of an Array', function isArray() {
    const coll = new Collection([]);
    expect(Array.isArray(coll)).toBe(true);
  });

  it('must be passed an array', function () {
    const passArray = () => new Collection([]);
    const passObj = () => new Collection({});
    const passNothing = () => new Collection();

    expect(passArray).not.toThrow();
    expect(passObj).toThrow();
    expect(passNothing).toThrow();
  });

  it('.add()', function () {
    const coll = new Collection([]);
    expect(coll.add).toBeDefined();
    const len = coll.length;
    coll.add({ hello: 'world' });
    expect(coll.length).toBe(len + 1);
  });

  it('.length', function () {
    const models = [
      { hello: 'world' },
      { hello: 'again' },
    ];

    const coll = new Collection(models);
    expect(coll.length).toBe(models.length);

  });

  it('.remove()', function () {
    const model = { hello: 'world' };
    const coll = new Collection([model]);
    expect(coll.remove).toBeDefined();
    coll.remove(model);
    expect(coll.length).toBe(0);
  });

});
