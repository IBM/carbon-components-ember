import { computed } from '@ember/object';
import GlimmerComponent from "@glimmer/component";

export function classPrefix(prefix) {
  return (target) => {
    target.prototype.classPrefix = prefix;
  };
}

export function bxClassNames(...names) {
  return (target, name, descriptor) => {

    const attrs = names.map(m => m.split(':'));

    function createMapping() {
      const mapping = {};
      attrs.forEach(([a, c]) => {
        if (!c) c = a;
        mapping[a] = target.classPrefix + c;
      });
      return mapping;
    }

    const props = attrs.map(a => a[0]);
    const decorator = computed(
      function() {
        const mapping = createMapping();
        return attrs.map(a => a[0]).map(a => ((String(this[a] || this.args && this.args[a]) === 'true') ? mapping[a] : null)).compact().join(' ');
      }
    );
    return decorator(target, name, descriptor);
  };
}

export function argsCompat(target, name, descriptor) {

  const init = descriptor.initializer;
  descriptor.initializer = function() {
    if (this instanceof GlimmerComponent) {
      return this.args;
    }
    const args = init(this);
    const context = this;
    Object.keys(args).forEach((k) => {
      Object.defineProperty(args, k, {
        get() {
          return context[k];
        }
      })
    });
    return args;
  };

  return descriptor;
}


export function componentArgs(target, name, descriptor) {
  const init = descriptor.initializer;
  descriptor.initializer = function() {
    const args = init(this);
    const context = this;
    Object.keys(args).forEach((k) => {
      const v = args[k];
      Object.defineProperty(args, k, {
        get() {
          if (context.attrs) {
            return (k in context.attrs) ? context.args[k] : v;
          }
          return (k in context.args) ? context.args[k] : v;
        }
      })
    });
    return args;
  };

  return descriptor;
}

export function defaultArgs(target, name, descriptor) {
  const init = descriptor.initializer;
  descriptor.initializer = function() {
    const args = init(this);
    const context = this;
    const origArgs = context.args;
    Object.keys(args).forEach((k) => {
      const v = args[k];
      Object.defineProperty(args, k, {
        get() {
          return (k in origArgs) ? origArgs[k] : v;
        }
      })
    });
    return args;
  };

  return descriptor;
}
