const Category = require('../../models/category');
const Document = require('../../models/document');

describe('Category', function CategoryTest() {

  it('new Category()', function newCategory() {

    const data = {
      title: 'Test Category',
      description: 'This is a test category.',
      extraProperty: 'extra property',
      type: 'test',
    };

    const badAbbr = () => new Category(Object.assign(data, { abbr: 'badABBR' }));
    const noData = () => new Category();
    const noDescription = () => new Category({ title: 'No Description' });
    const noTitle = () => new Category({ description: 'description' });

    const category = new Category(data);

    expect(badAbbr).toThrow();
    expect(noData).toThrow();
    expect(noDescription).toThrow();
    expect(noTitle).toThrow();
    expect(category instanceof Document).toBe(true);
    expect(category instanceof Category).toBe(true);
    expect(category.extraProperty).toBeUndefined();
    expect(category.type).toBe('category');

  });

  it('Category.prototype.abbr', function abbreviationTest() {

    const data = {
      title: 'Abbreviation Test',
      description: 'This is a test for the abbreviation property.',
      type: 'test',
    };

    const category = new Category(data);

    expect(category.abbr).toBe('abbreviationtest');
    expect(Object.getOwnPropertyDescriptor(category, 'abbr').configurable).toBe(false);

    const moreData = {
      title: 'Another Abbreviation Test',
      description: 'This is a test for the abbreviation property (again).',
      type: 'test',
      abbr: 'anotherabbrtest',
    };

    const anotherCategory = new Category(moreData);

    expect(anotherCategory.abbr).toBe(moreData.abbr);

  });

  it('Category.whitelist', function whitelistTest() {

    const whitelist = [
      'id',
      'type',
      '_attachments',
      '_etag',
      '_rid',
      '_self',
      '_ts',
      'ttl',
      'abbr',
      'description',
      'html',
      'markdown',
      'title',
    ];

    whitelist.forEach(attr => {
      expect(Category.whitelist.includes(attr)).toBe(true);
    });

  });

});
