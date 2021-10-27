const { targets: allTargets } = require('./utils');
console.log(allTargets);

run();

async function run() {
  await buildAll(allTargets);
}

async function build() {
  console.log('build...');
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