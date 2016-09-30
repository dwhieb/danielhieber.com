const Document = require('../../models/document');
const Education = require('../../models/education');

describe('Education', function EducationSpec() {

  const data = {
    endYear: 2016,
    location: 'Santa Barbara, CA',
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

    const noLoc = () => {
      const testData = Object.assign({}, data);
      delete testData.location;
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
    expect(ed.program).toBeUndefined();
    expect(ed.type).toBe('education');
    expect(ed.links).toBeDefined();
    expect(noEndYear).toThrow();
    expect(noLoc).toThrow();
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
    expect(Object.getOwnPropertyDescriptor(ed, 'achievements').enumerable).toBe(true);
    expect(ed.achievements.length).toBe(0);

    ed.achievements = arr;
    expect(ed.achievements).not.toBe(arr);

  });

  it('Education.prototype.organization', function orgAttr() {

    const ed = new Education(data);

    expect(ed.organization).toBe(data.organization);
    expect(Object.getOwnPropertyDescriptor(ed, 'organization').configurable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(ed, 'organization').enumerable).toBe(true);

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
    expect(Object.getOwnPropertyDescriptor(ed, 'program').enumerable).toBe(true);

    ed.program = undefined;
    expect(ed.program).toBe(String(undefined));

    ed.program = 2;
    expect(ed.program).toBe(String(2));

  });

  it('Education.whitelist', function whitelistAttr() {
    Education.whitelist.forEach(attr => {

      const whitelist = Document.whitelist.concat([
        'achievements',
        'endYear',
        'location',
        'organization',
        'program',
        'startYear',
      ]);

      expect(whitelist.includes(attr)).toBe(true);

    });
  });

});
