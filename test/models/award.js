const Award = require('../../models/award');

describe('Award', function AwardSpec() {

  it('new Award()', function newAward() {

    const data = {
      title: 'Test Award',
      year: 2016,
      description: 'This is a description.',
      extraProperty: 'This is an extra property.',
    };

    const badData = () => new Award(true);

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

    const noData = () => new Award();

    const noDescription = () => {
      const testData = Object.assign({}, data);
      delete testData.description;
      const award = new Award(testData);
      expect(award.description).toBe('');
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

    expect(badData).toThrow();
    expect(badYear1).toThrow();
    expect(badYear2).toThrow();
    expect(noData).toThrow();
    expect(noDescription).not.toThrow();
    expect(noTitle).toThrow();
    expect(noYear).toThrow();
    expect(award.extraProperty).toBeUndefined();

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