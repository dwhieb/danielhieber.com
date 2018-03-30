module.exports = (req, res, next) => {

  console.log(req.headers);
  console.log(process.env);

  res.redirect(`danielhieber-dev.azurewebsites.net/.auth/login/microsoft`);

  next();

};
