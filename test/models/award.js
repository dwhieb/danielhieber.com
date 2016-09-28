const Award = require('../../models/award');

// TODO: use methods for adding/removing categories and links, and make those properties read-only

// TODO: add the following methods
// - addLink()
// - removeLink()
// - addCategory()
// - removeCategory()

describe('Award', function AwardSpec() {

  it('new Award()', function newAward() {

    const data = {
      title: 'Test Award',
      year: 2016,
      description: 'This is a description.',
      categories: ['test', 'award'],
      links: { awardPage: 'http://award.com' },
      extraProperty: 'This is an extra property.',
    };

    const badCategories1 = () => {
      const testData = Object.assign({}, data);
      testData.categories = 'test';
      new Award(testData);
    };

    const badCategories2 = () => {
      const testData = Object.assign({}, data);
      testData.categories = [true, 'test'];
      new Award(testData);
    };

    const badData = () => new Award(true);

    const badDescription = () => {
      const testData = Object.assign({}, data);
      testData.description = 2;
      new Award(testData);
    };

    const badLinks = () => {
      const testData = Object.assign({}, data);
      testData.links.badLink = true;
      new Award(testData);
    };

    const badTitle = () => {
      const testData = Object.assign({}, data);
      testData.title = true;
      new Award(testData);
    };

    const badYear1 = () => {
      const testData = Object.assign({}, data);
      testData.year = true;
      new Award(testData);
    };

    const badYear2 = () => {
      const testData = Object.assign({}, data);
      testData.year = 2;
      new Award(testData);
    };

    const noCategories = () => {
      const testData = Object.assign({}, data);
      delete testData.categories;
      new Award(testData);
    };

    const noData = () => new Award();

    const noDescription = () => {
      const testData = Object.assign({}, data);
      delete testData.description;
      new Award(testData);
    };

    const noLinks = () => {
      const testData = Object.assign({}, data);
      delete testData.links;
      new Award(testData);
    };

    const noTitle = () => {
      const testData = Object.assign({}, data);
      delete testData.title;
      new Award(testData);
    };

    const noYear = () => {
      const testData = Object.assign({}, data);
      delete testData.year;
      new Award(testData);
    };

    const award = new Award(data);

    expect(badCategories1).toThrow();
    expect(badCategories2).toThrow();
    expect(badData).toThrow();
    expect(badDescription).toThrow();
    expect(badLinks).toThrow();
    expect(badTitle).toThrow();
    expect(badYear1).toThrow();
    expect(badYear2).toThrow();
    expect(noCategories).not.toThrow();
    expect(noData).toThrow();
    expect(noDescription).not.toThrow();
    expect(noLinks).not.toThrow();
    expect(noTitle).toThrow();
    expect(noYear).toThrow();
    expect(award.extraProperty).toBeUndefined();

  });

  it('Award.prototype.categories', function categoriesAttr() {

    const data = {
      title: 'Categories Test',
      year: 2016,
    };

    const award = new Award(data);

    const setBadCategories1 = () => {
      award.categories.push(2);
    };

    const setBadCategories2 = () => {
      award.categories = null;
    };

    expect(Array.isArray(award.categories)).toBe(true);
    expect(setBadCategories1).toThrow();
    expect(setBadCategories2).toThrow();

  });

  it('Award.prototype.description', function descriptionAttr() {

    const data = {
      title: 'Description Test',
      year: 2016,
      description: 'This is a description of the description test. Meta.',
    };

    const award = new Award(data);

    const setBadDescription = () => {
      award.description = null;
    };

    expect(award.description).toBe(data.description);
    expect(setBadDescription).toThrow();

  });

  it('Award.prototype.links', function linksAttr() {

    const data = {
      title: 'Links Test',
      year: 2016,
      links: { url: 'http://test.com' },
    };

    const award = new Award(data);

    const setBadLink = () => {
      award.links.url = null;
    };

    const setBadLinks = () => {
      award.links = null;
    };

    expect('url' in award.links).toBe(true);
    expect(award.links.url).toBe(data.links.url);
    expect(setBadLink).toThrow();
    expect(setBadLinks).toThrow();

  });

  it('Award.prototype.title', function titleAttr() {

    const data = {
      title: 'Title Test',
      year: 2016,
    };

    const award = new Award(data);
    const newTitle = 'New Award Title';

    const setBadTitle = () => {
      award.title = 2016;
    };

    expect(award.title).toBe(data.title);

    award.title = newTitle;

    expect(award.title).toBe(newTitle);
    expect(Object.getOwnPropertyDescriptor(award, 'title').configurable).toBe(false);
    expect(setBadTitle).toThrow();

  });

  it('Award.prototype.type', function typeAttr() {

    const data = {
      title: 'Type Test',
      year: 2016,
    };

    const award = new Award(data);

    expect(award.type).toBe('award');

  });

  it('Award.prototype.year', function yearAttr() {

    const data = {
      title: 'Year Test',
      year: 2016,
    };

    const award = new Award(data);

    const setBadYear = () => {
      award.year = '2016';
    };

    expect(award.year).toBe(data.year);
    expect(setBadYear).toThrow();

  });

  it('Award.whitelist', function whitelistAttr() {

    const whitelist = [
      'title',
      'year',
      'description',
      'categories',
      'links',
    ];

    whitelist.forEach(attr => {
      expect(Award.whitelist.includes(attr)).toBe(true);
    });

  });

});
