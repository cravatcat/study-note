const fs = require('fs-extra');
const path = require('path');
const execa = require('execa')
const { targets: allTargets } = require('./utils');

run();

async function run() {
  await buildAll(allTargets);
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  await fs.remove(`${pkgDir}/dist`)

  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `TARGET:${target}`,
      ]
    ],
    { stdio: 'inherit' }
  );
}

async function buildAll(targets) {
  await runParaller(require('os').cpus().length, targets, build);
}

async function runParaller(maxConcurrency, source, iteratorFn) {
  const ret = [];
  const executing = [];
  for(let item of source) {
    let p = Promise.resolve().then(() => iteratorFn(item, source));
    ret.push(p);
    if(maxConcurrency <= source.length) {
      let e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if(executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}