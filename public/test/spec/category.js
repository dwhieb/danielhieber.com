/* global Category */

/* eslint-disable
  func-names,
  prefer-arrow-callback
*/

// mock the socket.io object
const socket = {
  emit(eventName, model, cb) {
    cb(null, model);
  },
};

describe('Category', function CategorySpec() {

  it('new Category()', function () {
    expect(Category).toBeDefined();
    const data = {
      id: 'test',
      description: 'This is a test.',
    };
    const category = new Category(data);
    expect(category instanceof Category).toBe(true);
    expect(category.id).toBe(data.id);
    expect(category.name).toBe('');
  });

  it('Category.prototype.destroy()', function () {
    const data = {
      id: 'destroytest',
      name: 'Destroy Test',
      description: 'Test for Category.prototype.destroy().',
    };
    const category = new Category(data);
    expect(category.destroy).toBeDefined();
    expect(category.destroy() instanceof Promise).toBe(true);
  });

  it('Category.prototype.save()', function () {
    const data = {
      id: 'savetest',
      name: 'Save Test',
      description: 'Test for Category.prototype.save()',
    };
    const category = new Category(data);
    expect(category.save).toBeDefined();
    expect(category.save() instanceof Promise).toBe(true);
  });

});
