const path = require('path');
const rewriteModule = Object.entries(require.cache).find(([k, v]) => k.includes('@glint\\transform\\lib\\template\\rewrite-module'))?.[1].exports;
const fn = rewriteModule.rewriteModule;
let relativePath = null;
let currentTemplate = null;
function hbsImportsRewriteModule(ts, { script, template }, environment) {
  const cwd = process.cwd();
  relativePath = path.relative(cwd, template.filename);
  currentTemplate = template;
  return fn(ts, { script, template }, environment);
}
rewriteModule.rewriteModule = hbsImportsRewriteModule;

const glimmerPath = require.resolve('@glimmer/syntax', {paths: ["node_modules/@glint/transform/node_modules", "node_modules"]});
const glimmerTokenizer = require(path.join(glimmerPath.replace('index.js', ''), '/lib/parser/tokenizer-event-handlers'));
const glimmer = require('@glimmer/syntax');
const preprocess = glimmerTokenizer.preprocess;

const hbsImportsProcessor = require('ember-hbs-imports/lib/import-processor')
hbsImportsProcessor.default.options.useModifierHelperHelpers = true;
hbsImportsProcessor.default.options.useSafeImports = false;
hbsImportsProcessor.default.options.useHelperWrapper = false;
hbsImportsProcessor.default.options.warn = false;
hbsImportsProcessor.default.options.root = require('./package.json').name;
const hbsImportPreprocess = function(template) {
  const ast = preprocess(template);
  try {
    relativePath = relativePath.replace(/\\/g, '/');
    hbsImportsProcessor.default.replaceInAst(ast, relativePath);
    // currentTemplate.content = glimmer.print(ast);
  } catch (e) {
    console.error(e);
  }

  return ast;
}
glimmerTokenizer.preprocess = hbsImportPreprocess;
// patch glint to support ember-hbs-imports

const looseEnv = require('@glint/environment-ember-loose/-private/environment/index');
module.exports = looseEnv;


const glintTransform =  Object.entries(require.cache).find(([k, v]) => k.includes('@glint\\transform\\lib\\template\\transformed-module'))?.[1].exports;
const getOriginalRange = glintTransform.default.prototype.getOriginalRange;
glintTransform.default.prototype.getOriginalRange = function (...args) {
  const r = getOriginalRange.call(this, ...args);
  r.start = Math.max(r.start, 0);
  return r;
}
