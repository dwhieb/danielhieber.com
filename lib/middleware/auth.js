module.exports = (req, res, next) => {

  console.log(req.headers);
  console.log(process.env);

  res.redirect(`/.auth/login/microsoft`);

  // next();

};
