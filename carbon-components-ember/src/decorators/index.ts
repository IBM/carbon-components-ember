import Ember from 'ember';


export function classPrefix(prefix) {
  return (target) => {
    target.prototype.classPrefix = prefix;
  };
}

export function bxClassNames(...names): any {
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
    if (!descriptor) {
      Object.defineProperty(target, name, {
        get() {
          const mapping = createMapping();
          // @ts-ignore
          return attrs.map(a => a[0]).map(a => ((String(this[a] || this.args && this.args[a]) === 'true') ? mapping[a] : null)).compact().join(' ');
        }
      })
      return ;
    }

    const decorator = function() {
      const mapping = createMapping();
      // @ts-ignore
      return attrs.map(a => a[0]).map(a => ((String(this[a] || this.args && this.args[a]) === 'true') ? mapping[a] : null)).compact().join(' ');
    };
    return {
      get: decorator
    }
  };
}

export function defaultArgs(target, name, descriptor?) {
  if (typeof name !== 'string') {
    const defaultArgs = name;
    const args = target.args;
    return new Proxy({}, {
      get(target: any, p: string | symbol, receiver: any): any {
        if (p in args) {
          return args[p];
        }
        return defaultArgs[p];
      }
    });
  }
  const init = descriptor.initializer;
  descriptor.initializer = function() {
    const defaultArgs = init(this);
    const context = this;
    const origArgs = context.args;
    return new Proxy({}, {
      get(target: any, p: string | symbol, receiver: any): any {
        if (p in origArgs) {
          return origArgs[p];
        }
        return defaultArgs[p];
      }
    });
  };

  return descriptor;
}


export function autoComputed() {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const dec = (instance, key, desc) => require('@ember/-internals/metal').autoComputed()(instance, key, desc);
  // @ts-ignore
  return Ember.autoComputed || dec;
}
