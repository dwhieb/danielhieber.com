/* global Model, socket */

/* eslint-disable
  func-names,
  no-underscore-dangle,
  prefer-arrow-callback
*/

describe('Model', function ModelSpec() {

  it('new Model()', function newModelSpec() {
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

  it('Model.prototype.destroy()', function destroySpec(done) {

    const model = new Model({
      type: 'document',
      ttl: 300,
    });

    expect(model.delete).toBeUndefined();
    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'destroy').enumerable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'destroy').writable).toBe(false);

    // model should throw an error if there is no "id" attribute
    model.destroy()
    .then(res => fail(JSON.stringify(res, null, 2)))
    .catch(err => {
      expect(err.code).toBe(400);

      socket.emit('add', model, (err, res) => {
        if (err) {
          fail(JSON.stringify(err, null, 2));
          done();
        } else {

          const updatedModel = new Model(res);

          updatedModel.destroy()
          .then(res => {
            expect(res.code).toBe(204);
            done();
          })
          .catch(err => {
            fail(JSON.stringify(err, null, 2));
            done();
          });

        }
      });

    });

  });

  it('Model.prototype.json()', function jsonSpec() {
    const data = { id: 'test' };
    const model = new Model(data);
    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'json').enumerable).toBe(false);
    expect(model.json).toBe(JSON.stringify(data, null, 2));
  });

  it('Model.prototype.save()', function saveSpec(done) {

    const data = {
      type: 'document',
      ttl: 300,
      testProp: 'test property',
    };

    const model = new Model(data);

    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'save').enumerable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'save').writable).toBe(false);

    model.save()
    .then(res => {
      expect(res.testProp).toBe(data.testProp);
      expect(res._rid).toBeDefined();
      done();
    })
    .catch(err => {
      fail(JSON.stringify(err, null, 2));
      done();
    });

  });

  it('Model.prototype.update()', function updateSpec() {
    const model = new Model();
    expect(model.update).toThrow();
    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'update').enumerable).toBe(false);
    const updatedData = { newProperty: 'new property' };
    model.update(updatedData);
    expect(model.newProperty).toBe(updatedData.newProperty);
  });

  it('Model.prototype.data', function dataSpec() {
    const data = { id: 'test' };
    const model = new Model(data);
    expect(Object.is(model.data, data)).toBe(false);
    expect(model.data.id).toBe(data.id);
    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'data').get).toBeDefined();
    expect(Object.getOwnPropertyDescriptor(Model.prototype, 'data').enumerable).toBe(false);
  });

});
