const Document = require('../../models/document');
const Media = require('../../models/media');

describe('Media', function MediaSpec() {

  it('new Media()', function newMedia() {

    const required = [
      'author',
      'date',
      'publication',
      'title',
    ];

    expect(media.author).toBeDefined();
    expect(media.categories).toBeDefined();
    expect(media.links).toBeDefined();
    expect(media.publication).toBeDefined();
    expect(media.title).toBeDefined();

  });

  it('Media.prototype.date', function dateAttr() {

  });

  it('Media.whitelist', function whitelistAttr() {

  });

});
