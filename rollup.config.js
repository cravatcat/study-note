import path from 'path';
import ts from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

const packagesDir = path.resolve(__dirname, 'packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET);
const resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve('package.json'));
const packageOptions = pkg.buildOptions || {};
const name = packageOptions.filename || path.basename(packageDir);

console.log(name);

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },
  // runtime-only builds, for main "vue" package only
  'esm-bundler-runtime': {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`
  },
  'esm-browser-runtime': {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: 'es'
  },
  'global-runtime': {
    file: resolve(`dist/${name}.runtime.global.js`),
    format: 'iife'
  }
}

const packageFormats = packageOptions.formats;
const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]));

function createConfig(format, output) {
  const isGlobalBuild = /global/.test(format);
  if(isGlobalBuild) {
    output.name = packageOptions.name;
  }
  output.sourcemap = true;
  const entryFile = 'src/index.ts';
  return {
    input: resolve(entryFile),
    plugins: [
      json({}),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      })
    ],
    output,
  }
}
export default packageConfigs;