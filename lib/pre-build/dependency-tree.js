const BroccoliFilter = require('broccoli-persistent-filter');
const md5Hex = require('md5-hex');
const path = require('path');
const fs = require('fs');

const IMPORT_PATTERN = /\{\{\s*import\s+([a-zA-Z"']+[-,\w*\n'" ]+)\s+from\s+['"]([^'"]+)['"]\s*\}\}/g;

module.exports = class TemplateDependencyTreeProcessor extends BroccoliFilter {
  constructor(inputNode, options = {}) {
    if (!options.hasOwnProperty("persist")) {
      options.persist = true;
    }

    super(inputNode, {
      annotation: options.annotation,
      persist: options.persist
    });

    this.options = options;
    this._console = this.options.console || console;

    this.extensions = ["hbs", "handlebars"];
    this.targetExtension = "hbs";

    this.dependencyRules = {};
  }

  getRules() {
    const addonModules = {};
    const components = {};
    Object.keys(this.dependencyRules).forEach((dep) => {
      /**
       * @type {{dependsOnModules: string[],  dependsOnComponents: string[], components: string[]}}}
       */
      const dependency = this.dependencyRules[dep];
      // dependency.dependsOnModules = dependency.dependsOnModules.map(x => x.replace(this.options.package.name, 'addon'));
      // dependency.dependsOnComponents = dependency.dependsOnComponents.map(x => x.replace(this.options.package.name, 'addon'));
      // dependency.components = dependency.components.map(x => x.replace(this.options.package.name, 'addon'));
      addonModules[dep] = Object.assign({}, this.dependencyRules[dep]);
      delete addonModules[dep].components;
      dependency.components.forEach((comp) => {
        components[comp] = {
          layout: {
            addonPath: comp + '/template.hbs'
          }
        }
      });
    });
    const rules = {
      package: this.options.package.name,
      semverRange: this.options.package.version,
      addonModules: addonModules,
      components: components
    };
    return rules;
  }

  baseDir() {
    return __dirname;
  }

  cacheKeyProcessString(string, relativePath) {
    return md5Hex([string, relativePath, Math.random().toString()]);
  }

  processString(contents, relativePath) {
    if (relativePath in this.dependencyRules) {
      return contents;
    }
    let imports = {
      dependsOnModules: [],
      dependsOnComponents: [],
      components: []
    };
    contents.replace(IMPORT_PATTERN, (_, localName, importPath) => {
      if (importPath.endsWith('.scss')) { // .scss or other extensions
        return _;
      }
      if (importPath.startsWith('.')) {
        importPath = path.resolve(relativePath, '..', importPath).split(path.sep).join('/');
        importPath = path.relative(this.options.root, importPath).split(path.sep).join('/');
      }
      const hasMultiple = localName.includes(',')
      const localNames = localName.replace(/['"]/g, '').split(',');
      localNames.forEach((localName) => {
        localName = localName.trim();
        let importName = localName;
        if (localName.includes(' as ')) {
          [importName, localName] = localName.split(' as ');
          importName = importName.trim();
          localName = localName.trim();
        }
        if (importName === '*') {
          const name = localName + '\\.([^\\s\\)} |]+)';
          const helpModMatches = [...contents.matchAll(new RegExp(name, 'g'))].filter(x => !!x);
          helpModMatches.forEach((m) => {
            const im = m[1];
            if (im[0] === im[0].toUpperCase()) {
              imports.dependsOnComponents.push('{{component "' + importPath + '/' + im + '"}}');
              imports.components.push(importPath);
            } else {
              imports.dependsOnModules.push(importPath + '/' + im);
            }
          });

          const compNames = '<' + localName + '\\.([^\\s\\)} |>]+)$';
          const compModMatches = [...contents.matchAll(new RegExp(compNames, 'g'))].filter(x => !!x);
          compModMatches.forEach((m) => {
            const im = m[1];
            imports.dependsOnComponents.push('{{component "' + importPath + '/' + im + '"}}');
            imports.components.push(importPath + '/' + im);
          });
          return;
        }
        const fullPath = importPath + (hasMultiple ? ('/' + importName) : '');
        if (localName[0] === localName[0].toUpperCase()) {
          imports.dependsOnComponents.push('{{component "' + fullPath + '"}}')
          imports.components.push(fullPath);
        } else {
          imports.dependsOnModules.push(fullPath);
        }

      });
      return _;
    });
    relativePath = relativePath.replace('template.hbs', 'component.js');
    this.dependencyRules[relativePath] = imports;
    return contents;
  }
}
