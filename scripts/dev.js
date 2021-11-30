const execa = require('execa');
const args = require('minimist')(process.argv.slice(2));

const target = args.target;

build(target);

async function build(target) {
  await execa('rollup', ['-cw', '--environment', [`TARGET:${target}`, `SOURCE_MAP:ture`].join(',')], { stdio: 'inherit' })
}