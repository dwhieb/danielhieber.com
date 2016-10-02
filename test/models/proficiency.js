const Document = require('../../models/document');
const Proficiency = require('../../models/proficiency');

describe('Proficiency', function ProficiencySpec() {

  const data = {
    title: 'JavaScript',
    proficiencyType: 'skill',
  };

  it('new Proficiency()', function newProf() {

    const prof = new Proficiency(data);

    const noProfType = () => new Proficiency({ title: 'JavaScript' });
    const noTitle = () => new Proficiency({ proficiencyType: 'skill' });

    expect(prof instanceof Document).toBe(true);
    expect(prof instanceof Proficiency).toBe(true);
    expect(prof.categories).toBeDefined();
    expect(prof.links).toBeDefined();
    expect(prof.title).toBeDefined();
    expect(noTitle).toThrow();
    expect(noProfType).toThrow();

  });

  it('Proficiency.prototype.proficiencyType', function profTypeAttr() {

    const prof = new Proficiency(data);
    const setBadProfType = () => { prof.proficiencyType = 'coding'; };

    expect(prof.proficiencyType).toBe(data.proficiencyType);
    expect(setBadProfType).toThrow();

    prof.proficiencyType = 'software';
    expect(prof.proficiencyType).toBe('software');

  });

  it('Proficiency.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'categories',
      'links',
      'proficiencyType',
      'title',
    ]);

    whitelist.forEach(attr => {
      expect(Proficiency.whitelist.includes(attr)).toBe(true);
    });

    const prof = new Proficiency(data);

    for (const attr in prof) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
