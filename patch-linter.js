const path = require("path");

const index = process.argv.indexOf('--filename')
let relativePath = process.argv[index + 1];

const glimmerPath = require.resolve('@glimmer/syntax', { paths: ["node_modules/ember-template-recast/node_modules", "node_modules"] });
const glimmer = require(path.join(glimmerPath.replace('index.js', ''), '/lib/parser/tokenizer-event-handlers'));
const preprocess = glimmer.preprocess;

const hbsImportsProcessor = require('ember-hbs-imports/lib/import-processor')
const hbsImportPreprocess = function(template, opts) {
  const ast = preprocess(template, opts);
  hbsImportsProcessor.default.options.root = require('./package.json').name;
  hbsImportsProcessor.default.options.useModifierHelperHelpers = true;
  hbsImportsProcessor.default.options.useSafeImports = false;
  hbsImportsProcessor.default.options.useHelperWrapper = false;
  hbsImportsProcessor.default.replaceInAst(ast, relativePath);
  return ast;
}
glimmer.preprocess = hbsImportPreprocess;
