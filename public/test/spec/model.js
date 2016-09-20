/* global Model */

/* eslint-disable
  func-names,
  prefer-arrow-callback
*/

describe('Model', function () {

  it('new Model()', function () {
    const passNothing = () => new Model();
    const data = { id: 'test' };
    const model = new Model(data);
    const passModel = () => new Model(model);
    expect(passNothing).not.toThrow();
    expect(model instanceof Model).toBe(true);
    expect(model.id).toBe(data.id);
    expect(passModel).not.toThrow();
    const doubleModel = new Model(model);
    expect(doubleModel).toBe(model);
  });

  it('Model.prototype.delete()', function () {
    const model = new Model();
    expect(model.delete).toThrow();
  });

  it('Model.prototype.save()', function () {
    const model = new Model();
    expect(model.save).toThrow();
  });

  it('Model.prototype.update()', function () {
    const model = new Model();
    expect(model.update).toThrow();
  });

  it('Model.prototype.data', function () {
    const data = { id: 'test' };
    const model = new Model(data);
    expect(Object.is(model.data, data)).toBe(true);
  });

});
