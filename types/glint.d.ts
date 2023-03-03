

declare module 'ember-cli-addon-docs/components/docs-demo' {
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
  }

  export default class extends Component<Args> {}
}

declare module 'ember-tooltips/components/ember-tooltip' {
  import Component from '@glimmer/component';
  type Args = {
    isShown?: boolean;
    event?: 'none'|'hover';
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

declare module '@ember/helper' {
  export const fn: import('@glint/environment-ember-loose/-private/dsl/index').Globals['fn']
  export const get: import('@glint/environment-ember-loose/-private/dsl/index').Globals['get']
  export const concat: import('@glint/environment-ember-loose/-private/dsl/index').Globals['concat']
  export const on: import('@glint/environment-ember-loose/-private/dsl/index').Globals['on']
  export const array: import('@glint/environment-ember-loose/-private/dsl/index').Globals['array']
}

declare module '@ember/modifier' {
  export const on: import('@glint/environment-ember-loose/-private/dsl/index').Globals['on']
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
      Positional: [fn: (...args: any) => void, ...args: any];
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

declare module 'ember-power-select/components/power-select' {
  import '@gavant/glint-template-types/types/ember-power-select';
  export {
    PowerSelect as default,
    PowerSelectArgs
  } from '@gavant/glint-template-types/types/ember-power-select/components/power-select';
}

declare module 'ember-power-select/components/power-select-multiple' {
  import Component from '@glimmer/component';
  import '@gavant/glint-template-types/types/ember-power-select';
  import {
    PowerSelectMultipleSignature,
  } from '@gavant/glint-template-types/types/ember-power-select/components/power-select-multiple';
  export interface PowerSelectMultSignature<T> extends PowerSelectMultipleSignature<T> {
    Args: PowerSelectMultipleSignature<T>['Args'] & { eventType: 'click' };
  }
  export default class PowerSelectMultipleWithClick<T> extends Component<PowerSelectMultSignature<T>> {}
}


declare module 'ember-template-imports' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  export function hbs(contents: TemplateStringsArray): TemplateFactory;
}
