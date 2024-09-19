const { fork, execSync } = require("node:child_process");
const { join } = require("node:path");
const yaml = require("yaml");
const fs = require("fs");

try {
  const out = execSync(
    "npm i --no-save git+https://github.com/peter-evans/create-pull-request.git#v6.1.0",
    {
      cwd: __dirname,
    },
  );
  console.log(out);
} catch (e) {
  console.log(e);
  console.log(e.output?.toString());
  process.exit(-2);
}

const file = fs.readFileSync(
  join(__dirname, "./node_modules/create-pull-request/action.yml"),
  "utf8",
);
const info = yaml.parse(file);

process.env.GITHUB_WORKSPACE = process.cwd();
process.env.INPUT_SIGNOFF = true;

for (const [variable, value] of Object.entries(info.inputs)) {
  if (value.default !== undefined) {
    const k = "INPUT_" + variable.toUpperCase();
    process.env[k] = process.env[k] ?? value.default;
  }
}

const child = fork(
  join(__dirname, "./node_modules/create-pull-request/dist/index.js"),
);

child.on("error", (err) => {
  // This will be called with err being an AbortError if the controller aborts
  console.log("error", err);
  process.exit(-1);
});
