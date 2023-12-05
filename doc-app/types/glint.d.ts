declare module 'ember-cli-addon-docs/components/docs-demo' {
  import Component from '@glimmer/component';
  export default class extends Component {}
}

declare module 'ember-cli-addon-docs/components/docs-header' {
  import Component from '@glimmer/component';
  export default class extends Component {}
}

declare module 'ember-cli-addon-docs/components/docs-viewer' {
  import Component from '@glimmer/component';
  export default class extends Component {}
}

declare module 'ember-cli-addon-docs/components/docs-hero' {
  import Component from '@glimmer/component';
  type Args = {
    prefix: string;
    heading: string;
    byline: string;
  };

  export default class extends Component<Args> {}
}

declare module 'ember-composable-helpers/helpers/join' {
  function join(seperator: string, array: string[]): string;
  function join(array: string[]): string;
  export default join;
}
declare module 'ember-composable-helpers/helpers/range' {
  function range(start: number, end: number, isInclusive: boolean): number[];
  export default range;
}
declare module 'ember-composable-helpers/helpers/toggle' {
  function toggle(property: string, obj: object): () => void;
  export default toggle;
}
declare module 'ember-composable-helpers/helpers/call' {
  function call<R>(fn: () => R, thisArg?: object): R;
  export default call;
}

declare module '@ascua/arrays/helpers/split' {
  function split(seperator: string, text: string): string[];
  export default split;
}

declare module '@ascua/maths/helpers/div' {
  function div(a: number, b: number): number;
  export default div;
}

declare module 'ember-resize-modifier/modifiers/did-resize' {
  const didResize: import('@glint/template').ModifierLike<{
    Args: {
      Positional: [fn: (...args: any) => void, ...args: any];
    };
  }>;
  export default didResize;
}

declare module '@ember/render-modifiers/modifiers/did-insert' {
  const didInsert: import('@glint/template').ModifierLike<{
    Args: {
      Positional: [fn: (...args: any) => void, ...args: any];
    };
  }>;
  export default didInsert;
}

declare module '@ember/render-modifiers/modifiers/did-update' {
  const didUpdate: import('@glint/template').ModifierLike<{
    Args: {
      Positional: [fn: (...args: any[]) => any, ...args: any[]];
    };
  }>;
  export default didUpdate;
}

declare module '@ember/render-modifiers/modifiers/will-destroy' {
  const willDestroy: import('@glint/template').ModifierLike<{
    Args: {
      Positional: [fn: (...args: any) => void];
    };
  }>;
  export default willDestroy;
}
