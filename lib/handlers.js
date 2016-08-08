const capitalize = require('./utilities').capitalize;

exports.admin = (req, res) => {
  if (req.params.tool) {

    const toolName = req.params.tool.toLowerCase();

    res.render(`admin/${req.params.tool.toLowerCase()}`, {
      pageTitle: `${capitalize(toolName)} Admin`,
    });

  } else {

    res.render('admin/index', { pageTitle: 'Admin' });

  }
};

exports.bibliographies = (req, res) => res.render('languages/bibliography', {
  pageTitle: capitalize(req.params.language),
});

exports.blog = (req, res) => res.redirect('http://blog.danielhieber.com');

exports.cv = (req, res) => res.render('cv', { pageTitle: 'CV' });

exports.home = (req, res) => res.render('home', { pageTitle: 'Home' });

exports.languages = (req, res) => {
  if (req.params.language) {

    const langName = req.params.language.toLowerCase();
    res.render(`languages/${langName}`, { pageTitle: capitalize(langName) });

  } else {

    res.render('languages/index', { pageTitle: 'Languages' });

  }
};

exports.research = (req, res) => res.render('research', { pageTitle: 'Research' });
