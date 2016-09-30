const Document = require('../../models/document');
const Education = require('../../models/education');

describe('Education', function EducationSpec() {

  const data = {
    endYear: 2016,
    organization: 'University of California, Santa Barbara',
    startYear: 2013,
    extraProperty: 'This is an extra property.',
  };

  it('new Education()', function newEducation() {

    try {
      var ed = new Education(data);
    } catch (err) {
      fail(err);
    }

    const noEndYear = () => {
      const testData = Object.assign({}, data);
      delete testData.endYear;
      new Education(testData);
    };

    const noOrg = () => {
      const testData = Object.assign({}, data);
      delete testData.organization;
      new Education(testData);
    };

    const noStartYear = () => {
      const testData = Object.assign({}, data);
      delete testData.startYear;
      new Education(testData);
    };

    expect(ed.extraProperty).toBeUndefined();
    expect(ed.program).toBe('');
    expect(ed.type).toBe('education');
    expect(ed.links).toBeDefined();
    expect(noEndYear).toThrow();
    expect(noOrg).toThrow();
    expect(noStartYear).toThrow();

  });

  it('Education.prototype.addAchievement()', function addAchievementMethod() {

    const ed = new Education(data);
    const ach = 'I did lots of cool things.';
    const len = ed.achievements.length;

    ed.addAchievement(ach);
    expect(ed.achievements.length).toBe(len + 1);
    expect(ed.achievements.includes(ach)).toBe(true);

  });

  it('Education.prototype.removeAchievement()', function removeAchievementMethod() {

    const achievement = 'Cool stuff.';

    const testData = Object.assign({ achievements: [achievement] }, data);
    const ed = new Education(testData);

    expect(ed.achievements.length).toBe(1);
    ed.removeAchievement(achievement);
    expect(ed.achievements.length).toBe(0);

  });

  it('Education.prototype.achievements', function achievementsAttr() {

    const ed = new Education(data);
    const arr = [];

    expect(Array.isArray(ed.achievements)).toBe(true);
    expect(Object.getOwnPropertyDescriptor(ed, 'achievements').configurable).toBe(false);
    expect(ed.achievements.length).toBe(0);

    ed.achievements = arr;
    expect(ed.achievements).not.toBe(arr);

  });

  it('Education.prototype.endYear', function endYearAttr() {

    const ed = new Education(data);
    const setBadInteger = () => { ed.endYear = 2; };
    const setBadString = () => { ed.endYear = 'now'; };
    const setEmptyString = () => { ed.endYear = ''; };
    const setUndefined = () => { ed.endYear = undefined; };

    expect(ed.endYear).toBe(data.endYear);
    expect(Object.getOwnPropertyDescriptor(ed, 'endYear').configurable).toBe(false);
    expect(setBadInteger).toThrow();
    expect(setBadString).toThrow();
    expect(setEmptyString).toThrow();
    expect(setUndefined).toThrow();

  });

  it('Education.prototype.organization', function orgAttr() {

    const ed = new Education(data);

    expect(ed.organization).toBe(data.organization);
    expect(Object.getOwnPropertyDescriptor(ed, 'organization').configurable).toBe(false);

    ed.organization = undefined;
    expect(ed.organization).toBe(String(undefined));

    ed.organization = 2;
    expect(ed.organization).toBe(String(2));

  });

  it('Education.prototype.program', function programAttr() {

    const testData = Object.assign({ program: 'MA in Linguistics' }, data);

    const ed = new Education(testData);

    expect(ed.program).toBe(testData.program);
    expect(Object.getOwnPropertyDescriptor(ed, 'program').configurable).toBe(false);

    ed.program = undefined;
    expect(ed.program).toBe(String(undefined));

    ed.program = 2;
    expect(ed.program).toBe(String(2));

  });

  it('Education.prototype.startYear', function startYearAtt() {

    const ed = new Education(data);
    const setBadInteger = () => { ed.startYear = 2; };
    const setNonInteger = () => { ed.startYear = null; };

    expect(ed.startYear).toBe(data.startYear);
    expect(Object.getOwnPropertyDescriptor(ed, 'startYear').configurable).toBe(false);
    expect(setBadInteger).toThrow();
    expect(setNonInteger).toThrow();

  });

  it('Education.whitelist', function whitelistAttr() {
    Education.whitelist.forEach(attr => {

      const whitelist = Document.whitelist.concat([
        'achievements',
        'endYear',
        'organization',
        'program',
        'startYear',
      ]);

      expect(whitelist.includes(attr)).toBe(true);

    });
  });

});
