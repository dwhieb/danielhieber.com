const handlers = require('./handlers');

module.exports = app => {
  app.get('/', handlers.home);
  app.get('/admin', handlers.admin);
  app.get('/admin/:tool', handlers.admin);
  app.get('/blog', handlers.blog);
  app.get('/cv', handlers.cv);
  app.get('/languages', handlers.languages);
  app.get('/languages/:language', handlers.languages);
  app.get('/languages/:language/bibliography', handlers.bibliographies);
  app.get('/research', handlers.research);
};
