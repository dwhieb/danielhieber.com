const Document = require('../../models/document');
const Work = require('../../models/work');

describe('Work', function WorkSpec() {

  const data = {
    endYear: 'present',
    organization: 'UCSB',
    role: 'Grad Student',
    startYear: 2013,
  };

  it('new Work()', function newWork() {

    const work = new Work(data);

    const noEndYear = () => {
      const testData = Object.assign({}, data);
      delete testData.endYear;
      new Work(testData);
    };
    const noOrg = () => {
      const testData = Object.assign({}, data);
      delete testData.organization;
      new Work(testData);
    };
    const noRole = () => {
      const testData = Object.assign({}, data);
      delete testData.role;
      new Work(testData);
    };
    const noStartYear = () => {
      const testData = Object.assign({}, data);
      delete testData.startYear;
      new Work(testData);
    };

    expect(work instanceof Document).toBe(true);
    expect(work instanceof Work).toBe(true);
    expect(work.type).toBe('work');
    expect(work.extraProperty).toBeUndefined();
    expect(noEndYear).not.toThrow();
    expect(noOrg).toThrow();
    expect(noRole).toThrow();
    expect(noStartYear).toThrow();

  });

  it('Work.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'achievements',
      'categories',
      'endYear',
      'links',
      'organization',
      'role',
      'startYear',
    ]);

    whitelist.forEach(attr => {
      expect(Work.whitelist.includes(attr)).toBe(true);
    });

    const work = new Work(data);

    for (const attr in work) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });
});
