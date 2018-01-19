/**
 * A general LESS converter for folders. Accepts a path as input, and another path as output, and converts all the LESS files (and only LESS files) in the input folder, and outputs them as CSS to the output folder (and creates the output folder if it does not exist). Works both from the command line and as a Node module. Requires LESS as a dependency.
 *
 * From the command line:
 * `node less.js src/less dist/css`
 *
 * As a Node module:
 * const convertLess = require('./less');
 *
 * convertLess(`src/less`, `dist/css`).then().catch();
 */

/* eslint-disable
 func-style,
 no-console,
 no-sync,
 require-jsdoc
*/

const CleanCSS      = require('less-plugin-clean-css');
const fs            = require('fs');
const less          = require('less');
const path          = require('path');
const { promisify } = require('util');

const clean = new CleanCSS({
  advanced: false,
  keepBreaks: false,
  keepSpecialComments: `*`,
});

const mkdir     = promisify(fs.mkdir);
const readdir   = promisify(fs.readdir);
const readFile  = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const convertFile = (source, destination) => async filename => {
  const filePath = path.join(source, filename);
  const lessData = await readFile(filePath, `utf8`);
  const opts     = { plugins: [clean] };
  const { css }  = await less.render(lessData, opts);
  const name     = filename.replace(`.less`, `.css`);
  await writeFile(path.join(destination, name), css, `utf8`);
};

const getFilenames = async dir => {
  const filenames = await readdir(dir, `utf8`);
  return filenames.filter(filename => filename.endsWith(`.less`));
};

async function convertFolder(source = ``, destination = ``) {
  console.log(` -- Converting LESS files.`);
  if (!fs.existsSync(destination)) await mkdir(destination);
  const filenames = await getFilenames(source);
  await Promise.all(filenames.map(convertFile(source, destination)));
  console.log(` -- LESS files converted.`);
}

const [,, src, dest] = process.argv;

if (require.main === module) convertFolder(src, dest);
else module.exports = convertFolder;
