

declare module 'ember-cli-addon-docs/components/docs-demo' {
  import Component from '@glimmer/component';
  export default class extends Component {}
}

declare module 'ember-tooltips/components/ember-tooltip' {
  import Component from '@glimmer/component';
  type Args = {
    isShown?: boolean;
    event?: 'none'|'hover'
  };
  export default class extends Component<Args> {}
}

declare module 'ember-composable-helpers/helpers/join' {
  function join(seperator: string, array: string[]): string;
  function join(array: string[]): string;
  export default join;
}

declare module '@ember/helper' {
  export const fn: import('@glint/environment-ember-loose/-private/dsl/index').Globals['fn']
  export const on: import('@glint/environment-ember-loose/-private/dsl/index').Globals['on']
}

declare module '@ember/modifier' {
  export const on: import('@glint/environment-ember-loose/-private/dsl/index').Globals['on']
}


declare module '@ember/render-modifiers/modifiers/did-insert' {
  const didInsert: import('@glint/template').ModifierLike<{
    Args: {
      Positional: [fn: (...args: any) => void, ...args: any]
    }
  }>;
  export default didInsert;
}

declare module '@ember/render-modifiers/modifiers/did-update' {
  const didUpdate: import('@glint/template').ModifierLike<{
    Args: {
      Positional: [fn: (...args: any) => void, ...args: any]
    }
  }>;
  export default didUpdate;
}

declare module '@ember/render-modifiers/modifiers/will-destroy' {
  const willDestroy: import('@glint/template').ModifierLike<{
    Args: {
      Positional: [fn: (...args: any) => void]
    }
  }>;
  export default willDestroy;
}



