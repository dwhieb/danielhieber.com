const handlers = require('./handlers');

module.exports = app => {

  app.get('/', handlers.home);
  app.get('/admin', handlers.admin);
  app.get('/admin/:tool', handlers.admin);
  app.get('/blog', handlers.blog);
  app.get('/cv', handlers.cv);
  app.get('/home', handlers.home);
  app.get('/languages', handlers.languages);
  app.get('/languages/:language', handlers.languages);
  app.get('/languages/:language/bibliography', handlers.bibliographies);
  app.get('/publications', handlers.cv);
  app.get('/publications/:publication', handlers.publications);
  app.get('/publications/:publication/:file', handlers.publications);
  app.get('/research', handlers.research);
  app.get('/sandbox', handlers.sandbox);
  app.get('/sandbox/:project', handlers.sandbox);
  app.get('/vitae', handlers.cv);

  // generic error handlers
  app.use(handlers.error404);
  app.use(handlers.error500);

};
