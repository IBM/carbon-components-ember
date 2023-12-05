import { A } from '@ember/array';
import type Component from '@glimmer/component';

export function classPrefix(prefix: string) {
  return (target: any) => {
    target.prototype.classPrefix = prefix;
  };
}

export function bxClassNames(...names: string[]): any {
  return (target: any, name: any, descriptor: any) => {
    const attrs = names.map((m) => m.split(':')) as [string, string][];

    function createMapping() {
      const mapping: Record<string, string> = {};
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
          return A(
            attrs
              .map((a) => a[0])
              .map((a) =>
                String(this[a] || (this.args && this.args[a])) === 'true'
                  ? mapping[a]
                  : null,
              ),
          )
            .compact()
            .join(' ');
        },
      });
      return;
    }

    const decorator = function (this: any) {
      const mapping = createMapping();
      return A(
        attrs
          .map((a) => a[0])
          .map((a) =>
            String(this[a] || (this.args && this.args[a])) === 'true'
              ? mapping[a]
              : null,
          ),
      )
        .compact()
        .join(' ');
    };
    return {
      get: decorator,
    };
  };
}

export function defaultArgs<T extends object>(target: object, args: T): T;
export function defaultArgs(
  target: object,
  name?: string,
  descriptor?: any,
): void;

export function defaultArgs(target: any, name?: string, descriptor?: any) {
  if (!descriptor) {
    const defaultArgs = name as any;
    const args = target.args;
    return new Proxy(
      {},
      {
        get(target: any, p: string | symbol): any {
          if (p in args) {
            return args[p];
          }
          return defaultArgs[p];
        },
      },
    );
  }
  const init = descriptor.initializer;
  descriptor.initializer = function (this: Component) {
    const defaultArgs = init(this);
    const origArgs = this.args as any;
    return new Proxy(
      {},
      {
        get(target: any, p: string | symbol): any {
          if (p in origArgs) {
            return origArgs[p];
          }
          return defaultArgs[p];
        },
      },
    );
  };

  return descriptor;
}
