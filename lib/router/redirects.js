const blog = (req, res) => res.redirect(`http://blog.danielhieber.com`);
const dlx  = (req, res) => res.redirect(`https://digitallinguistics.io`);

module.exports = {
  blog,
  dlx,
};
