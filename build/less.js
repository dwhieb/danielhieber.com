/**
 * Compiles all the LESS files in the project (listed in `less.json`)
 * @name less.js
 */

const { env }               = require('../lib/config');
const Cleaner               = require('less-plugin-clean-css');
const { load: convertYAML } = require('js-yaml');
const less                  = require('less');
const path                  = require('path');
const { promisify }         = require('util');

const {
  readFile,
  writeFile,
}  = require('fs');

const cleaner = new Cleaner();
const read    = promisify(readFile);
const write   = promisify(writeFile);

const convert = async ([name, filepath]) => {

  const opts = {
    filename:   path.join(process.cwd(), filepath),
    plugins:    [cleaner],
    strictMath: true,
  };

  // if (env === `localhost` || env === `development`) {
  //   opts.sourceMap = {
  //     sourceMapFileInline: true,
  //   };
  // }

  const lessData = await read(filepath, `utf8`);
  const { css }  = await less.render(lessData, opts);
  await write(`public/css/${name}.css`, css, `utf8`);

};

void async function() {
  try {
    const yaml     = await read(`build/less.yaml`, `utf8`);
    const files    = convertYAML(yaml);
    const promises = Object.entries(files).map(convert);
    await Promise.all(promises);
    console.log(` -- LESS files converted`);
  } catch (e) {
    console.error(e);
  }
}();
