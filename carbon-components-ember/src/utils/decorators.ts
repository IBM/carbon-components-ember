import type Component from '@glimmer/component';

type Args = Record<PropertyKey, unknown>;

/** What decorator-transforms passes a legacy field decorator. */
interface FieldDescriptor {
  initializer: (instance: Component) => Args;
}

/** Reads each arg from `args`, falling back to `defaults`. */
function withDefaults(args: Args, defaults: Args): Args {
  return new Proxy(
    {},
    {
      get(_target, p) {
        return p in args ? args[p] : defaults[p];
      },
    },
  );
}

export function defaultArgs<T extends object>(target: object, args: T): T;
export function defaultArgs(
  target: object,
  name?: string,
  descriptor?: FieldDescriptor,
): void;

export function defaultArgs(
  target: object,
  nameOrDefaults?: string | object,
  descriptor?: FieldDescriptor,
): object | undefined {
  if (!descriptor) {
    // Called as `defaultArgs(this, defaults)` from a component.
    return withDefaults(
      (target as { args: Args }).args,
      nameOrDefaults as Args,
    );
  }
  const init = descriptor.initializer;
  descriptor.initializer = function (this: Component) {
    return withDefaults(this.args, init(this));
  };

  return descriptor;
}
