import { S as STRICT_MODE_KEYWORDS, p as precompile$1, a as STRICT_MODE_TRANSFORMS, R as RESOLUTION_MODE_TRANSFORMS } from './index-Bgg7OGvt.js';
export { b as _preprocess, c as _print } from './index-Bgg7OGvt.js';
import { R as Cache } from './main-B8rrDxlx.js';
import './index-CRaCx-JV.js';

/*
  This diverges from `Ember.String.dasherize` so that`<XFoo />` can resolve to `x-foo`.
  `Ember.String.dasherize` would resolve it to `xfoo`..
*/
const SIMPLE_DASHERIZE_REGEXP = /[A-Z]|::/g;
const ALPHA = /[A-Za-z0-9]/;
const COMPONENT_NAME_SIMPLE_DASHERIZE_CACHE = new Cache(1000, key => key.replace(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
  if (char === '::') {
    return '/';
  }
  if (index === 0 || !ALPHA.test(key[index - 1])) {
    return char.toLowerCase();
  }
  return `-${char.toLowerCase()}`;
}));
let USER_PLUGINS = [];
function buildCompileOptions(_options) {
  let moduleName = _options.moduleName;
  let options = Object.assign({
    meta: {},
    isProduction: false,
    plugins: {
      ast: []
    }
  }, _options, {
    moduleName,
    customizeComponentName(tagname) {
      return COMPONENT_NAME_SIMPLE_DASHERIZE_CACHE.get(tagname);
    }
  });
  if ('locals' in options && !options.locals) {
    // Glimmer's precompile options declare `locals` like:
    //    locals?: string[]
    // but many in-use versions of babel-plugin-htmlbars-inline-precompile will
    // set locals to `null`. This used to work but only because glimmer was
    // ignoring locals for non-strict templates, and now it supports that case.
    delete options.locals;
  }

  // move `moduleName` into `meta` property
  if (options.moduleName) {
    let meta = options.meta;
    meta.moduleName = options.moduleName;
  }
  if (options.strictMode) {
    options.keywords = STRICT_MODE_KEYWORDS;
  }
  return options;
}
function transformsFor(options) {
  return options.strictMode ? STRICT_MODE_TRANSFORMS : RESOLUTION_MODE_TRANSFORMS;
}
function compileOptions(_options = {}) {
  let options = buildCompileOptions(_options);
  let builtInPlugins = transformsFor(options);
  if (!_options.plugins) {
    options.plugins = {
      ast: [...USER_PLUGINS, ...builtInPlugins]
    };
  } else {
    let potententialPugins = [...USER_PLUGINS, ...builtInPlugins];
    let pluginsToAdd = potententialPugins.filter(plugin => {
      return options.plugins.ast.indexOf(plugin) === -1;
    });
    options.plugins.ast = options.plugins.ast.concat(pluginsToAdd);
  }
  return options;
}

/**
@module ember
*/

/**
  Uses HTMLBars `compile` function to process a string into a compiled template string.
  The returned string must be passed through `Ember.HTMLBars.template`.

  This is not present in production builds.

  @private
  @method precompile
  @param {String} templateString This is the string to be compiled by HTMLBars.
*/
function precompile(templateString, options = {}) {
  return precompile$1(templateString, compileOptions(options));
}

export { buildCompileOptions as _buildCompileOptions, precompile };
