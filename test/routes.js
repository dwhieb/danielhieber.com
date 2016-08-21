/* eslint-disable no-magic-numbers, no-console, max-nested-callbacks */

const app = require('../app');
const supertest = require('supertest');

describe('routes', function routes() {

  const req = supertest(app);

  it('GET /notfound', function notFound(done) {
    req.get('/notfound')
    .expect(404)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /', function nopath(done) {
    req.get('/')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /admin', function admin(done) {
    req.get('/admin')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /admin/CV', function cvAdmin(done) {
    req.get('/admin/CV')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /admin/blog', function blogAdmin(done) {
    req.get('/admin/blog')
    .expect(302)
    .expect('Location', 'https://blog.danielhieber.com/ghost')
    .end(err => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /admin/categories', function categoriesAdmin(done) {
    req.get('/admin/categories')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /blog', function blog(done) {
    req.get('/blog')
    .expect(302)
    .expect('Location', 'http://blog.danielhieber.com')
    .end(err => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /cv', function cv(done) {
    req.get('/cv')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  // tests that `/cv` and `/CV` both return the CV page
  it('GET /CV', function CV(done) {
    req.get('/CV')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /home', function home(done) {
    req.get('/home')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /languages', function languages(done) {
    req.get('/languages')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /languages/chitimacha', function language(done) {
    req.get('/languages/chitimacha')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  // checks that both `/chitimacha` and `/Chitimacha` return the correct page
  it('GET /languages/Chitimacha', function Language(done) {
    req.get('/languages/Chitimacha')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /languages/Chitimacha/bibliography', function bibliography(done) {
    req.get('/languages/Chitimacha/bibliography')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /publications', function pubs(done) {
    req.get('/publications')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  xit('GET /publications/1', function pub(done) {
    req.get('/publications/1')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  xit('GET /publications/1/pdf', function pdf(done) {
    req.get('/publications/1/pdf')
    .expect(200)
    .expect('Content-Type', 'application/pdf')
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  // test for slides written in PowerPoint
  xit('GET /publications/1/slides', function pptSlides(done) {
    const pptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

    req.get('/publications/1/slides')
    .expect(200)
    .expect('Content-Type', pptx)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  // test for slides written in reveal.js
  xit('GET /publications/2/slides', function htmlSlides(done) {
    req.get('/publications/2/slides')
    .expect(200)
    .expect('Content-Type', 'text/html')
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  // tests for slides that can be presented with reveal.js
  xit('GET /publications/2/present', function presentSlides(done) {
    req.get('/publications/2/present')
    .expect(200)
    .expect('Content-Type', 'text/html')
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /research', function research(done) {
    req.get('/research')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

  it('GET /vitae', function vitae(done) {
    req.get('/vitae')
    .expect(200)
    .end((err, res) => {
      if (err) fail(err);
      done();
    });
  });

});
