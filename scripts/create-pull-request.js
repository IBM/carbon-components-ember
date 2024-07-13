const { fork } = require('node:child_process');
const yaml = require('yaml');
const fs = require('fs');

const file = fs.readFileSync('./node_modules/create-pull-request/action.yml', 'utf8')
const info = yaml.parse(file)

process.env.GITHUB_WORKSPACE = process.cwd();

for (const [variable, value] of Object.entries(info.inputs)) {
  if (value.default !== undefined) {
    const k = 'INPUT_' + variable.toUpperCase();
    process.env[k] = process.env[k] || value.default;
  }
}

const child = fork('./node_modules/create-pull-request/dist/index.js');

child.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
  console.log('error', err);
});
