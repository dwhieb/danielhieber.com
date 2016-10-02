const Category = require('../../models/category');
const Document = require('../../models/document');

describe('Category', function CategoryTest() {

  const data = {
    title: 'Test Category',
    description: 'This is a test category.',
    extraProperty: 'extra property',
    type: 'test',
  };


  it('new Category()', function newCategory() {

    const badKey = () => {
      const testData = Object.assign({}, data);
      testData.key = 'badKEY';
      new Category(testData);
    };
    const noData = () => new Category();
    const noDescription = () => new Category({ title: 'No Description' });
    const noTitle = () => new Category({ description: 'description' });

    const category = new Category(data);

    expect(badKey).toThrow();
    expect(noData).toThrow();
    expect(noDescription).toThrow();
    expect(noTitle).toThrow();
    expect(category instanceof Document).toBe(true);
    expect(category instanceof Category).toBe(true);
    expect(category.extraProperty).toBeUndefined();
    expect(category.type).toBe('category');

  });

  it('Category.prototype.key', function keyAttr() {

    const data = {
      title: 'Key Test',
      description: 'This is a test for the "key" attribute.',
      type: 'test',
    };

    const category = new Category(data);

    expect(category.key).toBe('keytest');
    expect(Object.getOwnPropertyDescriptor(category, 'key').configurable).toBe(false);

    const moreData = {
      title: 'Another Key Test',
      description: 'This is a test for the key property (again).',
      type: 'test',
      key: 'anotherkeytest',
    };

    const anotherCategory = new Category(moreData);

    expect(anotherCategory.key).toBe(moreData.key);

  });

  it('Category.whitelist', function whitelistTest() {

    const whitelist = Document.whitelist.concat([
      'key',
      'description',
      'html',
      'markdown',
      'title',
    ]);

    whitelist.forEach(attr => {
      expect(Category.whitelist.includes(attr)).toBe(true);
    });

    const category = new Category(data);

    for (const attr in category) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
