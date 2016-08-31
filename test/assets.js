/* eslint-disable no-magic-numbers, no-console, max-nested-callbacks */

const app = require('../app');
const supertest = require('supertest');

describe('assets', function assets() {

  const req = supertest(app);

  it('can retrieve gallery images', function getGalleryImage(done) {
    req.get('/img/gallery/cypress_trees.jpg')
    .expect(200)
    .expect('Content-Type', 'image/jpeg')
    .end((err, res) => {
      if (err) fail(JSON.stringify(err, null, 2));
      done();
    });
  });

  it('can retrieve CSS files', function getCSSFiles(done) {
    req.get('/css/home.css')
    .expect(200)
    .expect('Content-Type', 'text/css; charset=UTF-8')
    .end((err, res) => {
      if (err) fail(JSON.stringify(err, null, 2));
      done();
    });
  });

  it('can retrieve JS files', function getJSFiles(done) {
    req.get('/js/posts.js')
    .expect(200)
    .expect('Content-Type', 'application/javascript')
    .end((err, res) => {
      if (err) fail(JSON.stringify(err, null, 2));
      done();
    });
  });

  it('can retrieve fonts', function getFonts(done) {
    req.get('/fonts/FiraSans-MediumItalic.woff2')
    .expect(200)
    .expect('Content-Type', 'application/font-woff2')
    .end((err, res) => {
      if (err) fail(JSON.stringify(err, null, 2));
      done();
    });
  });

});
