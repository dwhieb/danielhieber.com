/**
 * Creates the SVG symbols file (public/img/sprites.svg) for embedding in the HTML
 */

const fs            = require('fs');
const path          = require('path');
const { promisify } = require('util');
const Spriter       = require('svg-sprite');

const opts = {
  dest:  `public/img`,
  mode:  {
    symbol: {
      inline: true,
    },
  },
  shape: {
    id: {
      generator(name, file) {
        return path.parse(file.path).name;
      },
    },
  },
  svg: {
    dimensionAttributes: true,
    rootAttributes:      {
      style: `display: none;`,
    },
    xmlDeclaration: false,
  },
};

const spriter = new Spriter(opts);

const compile = promisify(spriter.compile).bind(spriter);
const readdir = promisify(fs.readdir);
const read    = promisify(fs.readFile);
const write   = promisify(fs.writeFile);

void async function() {

  const addIcon = async filename => {
    const filepath = `public/img/icons/${filename}`;
    const svg      = await read(filepath, `utf8`);
    spriter.add(filepath, null, svg);
  };

  const icons = await readdir(`public/img/icons`, `utf8`);
  await Promise.all(icons.map(addIcon));
  const result = await compile();
  await write(`public/img/sprites.svg`, result.symbol.sprite.contents);

  console.log(` -- SVG sprites created`);

}();
