const port = 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'localhost';
process.env.PORT = process.env.PORT || port;

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
};
