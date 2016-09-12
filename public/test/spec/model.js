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
    expect(passNothing).not.toThrow();
    expect(model.id).toBe(data.id);
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
    const originalData = { id: 'test1', type: 'model' };
    const updatedData = { id: 'test2' };
    const model = new Model(originalData);
    model.update(updatedData);
    expect(model.id).toBe(updatedData.id);
    expect(model.type).toBe(originalData.type);
  });

  it('Model.prototype.data', function () {
    const data = { id: 'test' };
    const model = new Model(data);
    expect(Object.is(model.data, data)).toBe(true);
  });

});
