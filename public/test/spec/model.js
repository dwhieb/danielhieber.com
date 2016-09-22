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
    const doubleModel = new Model(model);
    const passModel = () => new Model(model);
    expect(passNothing).not.toThrow();
    expect(model instanceof Model).toBe(true);
    expect(model.id).toBe(data.id);
    expect(model.emit).toBeDefined();
    expect(passModel).not.toThrow();
    expect(doubleModel).not.toBe(model);
  });

  it('Model.prototype.destroy()', function () {
    const model = new Model();
    expect(model.delete).toBeUndefined();
    expect(model.destroy).toBeDefined();
    expect(model.destroy).toThrow();
    expect(Object.getOwnPropertyDescriptor(model, 'destroy').enumerable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(model, 'destroy').writable).toBe(true);
  });

  it('Model.prototype.json()', function () {
    const data = { id: 'test' };
    const model = new Model(data);
    expect(Object.getOwnPropertyDescriptor(model, 'json').enumerable).toBe(false);
    expect(model.json()).toBe(JSON.stringify(data, null, 2));
  });

  it('Model.prototype.save()', function () {
    const model = new Model();
    expect(model.save).toThrow();
    expect(Object.getOwnPropertyDescriptor(model, 'save').enumerable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(model, 'save').writable).toBe(true);
  });

  it('Model.prototype.update()', function () {
    const model = new Model();
    expect(model.update).toThrow();
    expect(Object.getOwnPropertyDescriptor(model, 'update').enumerable).toBe(false);
  });

  it('Model.prototype.data', function () {
    const data = { id: 'test' };
    const model = new Model(data);
    expect(Object.is(model.data, data)).toBe(false);
    expect(Object.getOwnPropertyDescriptor(model, 'data').get).toBeDefined();
    expect(Object.getOwnPropertyDescriptor(model, 'data').enumerable).toBe(false);
  });

});
