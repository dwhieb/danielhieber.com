const express = require('express');
const path    = require('path');

const setHeaders = res => res.set(`Service-Worker-Allowed`, `/`);

const opts = { setHeaders };
const dir  = path.join(__dirname, `../../public`);

module.exports = express.static(dir, opts);
