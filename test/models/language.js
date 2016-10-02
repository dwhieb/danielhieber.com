const Document = require('../../models/document');
const Language = require('../../models/language');

describe('Language', function LangSpec() {

  const data = {
    title: 'Swahili',
    autonym: 'Kiswahili',
    competency: 'Advanced',
    extraProperty: 'This is an extra property.',
  };

  it('new Language()', function newLanguage() {

    const lang = new Language(data);

    const noAuto = () => {
      const testData = Object.assign({}, data);
      delete testData.autonym;
      new Language(testData);
    };
    const noComp = () => {
      const testData = Object.assign({}, data);
      delete testData.competency;
      new Language(testData);
    };
    const noTitle = () => {
      const testData = Object.assign({}, data);
      delete testData.title;
      new Language(testData);
    };

    expect(lang instanceof Document).toBe(true);
    expect(lang instanceof Language).toBe(true);
    expect(lang.type).toBe('language');
    expect(lang.extraProperty).toBeUndefined();
    expect(lang.categories).toBeDefined();
    expect(lang.links).toBeDefined();
    expect(noAuto).toThrow();
    expect(noComp).toThrow();
    expect(noTitle).toThrow();

  });

  it('Language.prototype.autonym', function autonymAttr() {

    const lang = new Language(data);
    const setNonString = () => {
      lang.autonym = 2;
      expect(lang.autonym).toBe(String(2));
    };

    expect(lang.autonym).toBe(data.autonym);
    expect(setNonString).not.toThrow();

  });

  it('Language.prototype.competency', function competencyAttr() {

    const lang = new Language(data);
    const setBadComp = () => { lang.competency = 'poor'; };

    expect(lang.competency).toBe(data.competency.toLowerCase());
    expect(setBadComp).toThrow();

  });

  it('Language.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'autonym',
      'categories',
      'competency',
      'links',
      'title',
    ]);

    whitelist.forEach(attr => {
      expect(Language.whitelist.includes(attr)).toBe(true);
    });

    const lang = new Language(data);

    for (const attr in lang) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
