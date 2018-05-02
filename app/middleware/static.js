const express = require('express');
const path    = require('path');

const dir  = path.join(__dirname, `../../public`);

module.exports = express.static(dir);
