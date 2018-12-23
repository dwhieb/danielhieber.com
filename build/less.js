/**
 * Compiles all the LESS files for the project
 */

// IMPORTS

const Cleaner       = require(`less-plugin-clean-css`);
const createSpinner = require(`ora`);
const less          = require(`less`);
const path          = require(`path`);
const { promisify } = require(`util`);
const recurse       = require(`recursive-readdir`);
const rimraf        = require(`rimraf`);

const {
  mkdir,
  readFile,
  writeFile,
} = require(`fs`).promises;

// SETUP

const cleaner     = new Cleaner();
const CSSDir      = path.join(__dirname, `../public/css`);
const mainCSSFile = path.join(__dirname, `../views/layouts/main/main.less`);
const pagesDir    = path.join(__dirname, `../views/pages`);
const removeDir   = promisify(rimraf);

// METHODS

async function buildCSS() {

  const spinner = createSpinner(`Converting LESS files`);
  spinner.start();

  try {
    await removeDir(CSSDir);
    await mkdir(CSSDir);
    await convertFile(mainCSSFile);
    const files = await recurse(pagesDir, [ignore]);
    await Promise.all(files.map(convertFile));
  } catch (e) {
    return spinner.fail(e.message);
  }

  spinner.succeed(`LESS files converted`);

}

async function convertFile(filepath) {

  const opts = {
    filename:   filepath,
    plugins:    [cleaner],
    strictMath: true,
  };

  const lessData = await readFile(filepath, `utf8`);
  const { css }  = await less.render(lessData, opts);
  const filename = path.basename(filepath, `.less`);
  const outpath  = path.join(CSSDir, `${filename}.css`);
  await writeFile(outpath, css, `utf8`);

}

function ignore(filepath, stats) {
  const basename = path.basename(filepath);
  if (basename === `components` || basename === `less`) return true;
  if (stats.isFile() && path.extname(filepath) !== `.less`) return true;
}

// INITIALIZATION

if (require.main === module) buildCSS();
else module.exports = buildCSS;
