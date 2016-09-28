/* eslint-disable object-property-newline */

const Category = require('../../models/category');
const Document = require('../../models/document');
const md = require('markdown').markdown;

describe('Category', function CategoryTest() {

  it('new Category()', function newCategory() {

    const data = {
      name: 'Test Category',
      description: 'This is a test category.',
      extraProperty: 'extra property',
      type: 'test',
    };

    const badAbbr = () => new Category(Object.assign(data, { abbr: 'badABBR' }));
    const noData = () => new Category();
    const noDescription = () => new Category({ name: 'No Description' });
    const noName = () => new Category({ description: 'description' });
    const nonString = () => new Category({ name: true, description: 'description' });

    const category = new Category(data);

    expect(badAbbr).toThrow();
    expect(noData).toThrow();
    expect(noDescription).toThrow();
    expect(noName).toThrow();
    expect(nonString).toThrow();
    expect(category instanceof Document).toBe(true);
    expect(category instanceof Category).toBe(true);
    expect(category.extraProperty).toBeUndefined();
    expect(category.type).toBe('category');

  });

  it('Category.prototype.abbr', function abbreviationTest() {

    const data = {
      name: 'Abbreviation Test',
      description: 'This is a test for the abbreviation property.',
      type: 'test',
    };

    const category = new Category(data);

    expect(category.abbr).toBe('abbreviationtest');
    expect(Object.getOwnPropertyDescriptor(category, 'abbr').configurable).toBe(false);

    const moreData = {
      name: 'Another Abbreviation Test',
      description: 'This is a test for the abbreviation property (again).',
      type: 'test',
      abbr: 'anotherabbrtest',
    };

    const anotherCategory = new Category(moreData);

    expect(anotherCategory.abbr).toBe(moreData.abbr);

  });

  it('Category.prototype.description', function descriptionTest() {

    const data = {
      name: 'Description Test',
      description: 'This is a **test** for the "description" [attribute](#link).',
    };

    const category = new Category(data);
    const newText = '*New* text!';
    category.markdown = newText;

    expect(category.description).toBe(newText);

    category.description = newText;

    expect(category.html).toBe(md.toHTML(category.markdown));

  });

  it('Category.prototype.html', function htmlTest() {

    const data = {
      name: 'HTML Test',
      description: 'This is a test for the "html" attribute.',
      type: 'test',
    };

    const category = new Category(data);

    expect(category.html).toBe(md.toHTML(data.description));

    const description = 'This is a new *description*.';

    category.description = description;

    expect(category.html).toBe(md.toHTML(description));

  });

  it('Category.prototype.markdown', function markdownTest() {

    const data = {
      name: 'Markdown Test',
      description: 'This is a **test** for the "markdown" [attribute](#link).',
      type: 'test',
    };

    const category = new Category(data);

    const setmd = () => {
      const markdown = 'This is some *new* markdown.';
      category.markdown = markdown;
    };

    expect(category.markdown).toBe(data.description);
    expect(setmd).not.toThrow();

  });

  it('Category.prototype.name', function nameTest() {

    const data = {
      name: 'Name Test',
      description: 'This is a test for the "name" attribute.',
      type: 'test',
    };

    const category = new Category(data);

    expect(Object.getOwnPropertyDescriptor(category, 'name').configurable).toBe(false);
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
      'name',
      'abbr',
      'html',
      'markdown',
      'description',
    ];

    whitelist.forEach(attr => {
      expect(Category.whitelist.includes(attr)).toBe(true);
    });

  });

});
