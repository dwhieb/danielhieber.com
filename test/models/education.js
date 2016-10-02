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

  it('Education.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'achievements',
      'endYear',
      'links',
      'location',
      'organization',
      'program',
      'startYear',
    ]);

    whitelist.forEach(attr => {
      expect(Education.whitelist.includes(attr)).toBe(true);
    });

    const ed = new Education(data);

    for (const attr in ed) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
