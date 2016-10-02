const Document = require('../../models/document');
const Service = require('../../models/service');

describe('Service', function ServiceSpec() {

  const data = {
    endYear: null,
    organization: 'Society for the Study of the Indigenous Languages of the Americas',
    role: 'Webmaster',
    startYear: 2013,
    extraProperty: true,
  };

  it('new Service()', function newService() {

    const service = new Service(data);

    expect(service instanceof Document).toBe(true);
    expect(service instanceof Service).toBe(true);
    expect(service.extraProperty).toBeUndefined();
    expect(service.categories).toBeDefined();
    expect(service.endYear).toBeUndefined();
    expect(service.links).toBeDefined();
    expect(service.organization).toBe(data.organization);
    expect(service.role).toBe(data.role);
    expect(service.startYear).toBe(data.startYear);

  });

  it('Service.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'abbreviation',
      'categories',
      'endYear',
      'links',
      'organization',
      'role',
      'startYear',
    ]);

    whitelist.forEach(attr => {
      expect(Service.whitelist.includes(attr)).toBe(true);
    });

    const service = new Service(data);

    for (const attr in service) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
