/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */


import { computed } from '@ember/object';

export function classPrefix(prefix) {
  return (target) => {
    target.prototype.classPrefix = prefix;
  };
}

export function index(...names) {
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

    const props = attrs.map(a => `attrs.${a[0]}`);
    const decorator = computed(
      props.join(','),
      function() {
        const mapping = createMapping();
        return attrs.map(a => a[0]).map(a => ((String(this[a]) === 'true') ? mapping[a] : null)).compact().join(' ');
      }
    );
    return decorator(target, name, descriptor);
  };
}

export function argsCompat(target, name, descriptor) {

  const init = descriptor.initializer;
  descriptor.initializer = function() {
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
