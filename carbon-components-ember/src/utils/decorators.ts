import type Component from '@glimmer/component';

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
