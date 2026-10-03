// (UN)SAFETY: the public API is that people can import and use this (and indeed
// it is emitted as part of Ember's build!), so we define it as having the type
// which makes that work. However, in practice it is supplied by the build,
// *for* the build, and will *not* be present at runtime, so the actual value
// here is `undefined` in prod; in dev it is a function which throws a somewhat
// nicer error. This is janky, but... here we are.

let __emberTemplateCompiler;
const compileTemplate = (...args) => {
  if (!__emberTemplateCompiler) {
    throw new Error('Attempted to call `compileTemplate` without first loading the runtime template compiler.');
  }
  return __emberTemplateCompiler.compile(...args);
};
let precompileTemplate;
function __registerTemplateCompiler(c) {
  __emberTemplateCompiler = c;
}

export { __emberTemplateCompiler, __registerTemplateCompiler, compileTemplate, precompileTemplate };
