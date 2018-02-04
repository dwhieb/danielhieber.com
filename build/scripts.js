const { transformFile }       = require('babel-core');
const { load: convertYAML }   = require('js-yaml');
const { readFile, writeFile } = require('fs');
const { resolve }             = require('path');
const { promisify }           = require('util');

const read      = promisify(readFile);
const transform = promisify(transformFile);
const write     = promisify(writeFile);

const processFile = async ([name, path]) => {
  const { code, map }    = await transform(path);
  const outpath          = `public/js/${name}.js`;
  const mapOutpath       = outpath + `.map`;
  const sourceMappingURL = `//# sourceMappingURL=/js/${name}.js.map`;
  const js               = `${code} ${sourceMappingURL}`;
  const sourceMap        = JSON.stringify(map, null, 2);
  await write(outpath, js, `utf8`);
  await write(mapOutpath, sourceMap, `utf8`);
};

const processWorker = async () => {
  const workerPath = `views/layouts/main/offline-worker.js`;
  const outPath    = `public/offline-worker.js`;
  const { code }   = await transform(workerPath);
  await write(outPath, code, `utf8`);
};

void async function() {
  const scriptsPath = resolve(__dirname, `scripts.yaml`);
  const yaml        = await read(scriptsPath, `utf8`);
  const files       = convertYAML(yaml);
  const promises    = Object.entries(files).map(processFile);
  await Promise.all(promises);
  await processWorker();
}();
