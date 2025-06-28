import Component from '@glimmer/component';

export type Args = {
  type:
    | 'red'
    | 'magenta'
    | 'purple'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'green'
    | 'gray'
    | 'cool-gray'
    | 'warm-gray';
};

export interface TagInterface {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class TagComponent extends Component<TagInterface> {
  get type() {
    const types =
      'red magenta purple blue cyan teal green gray cool-gray warm-gray'.split(
        ' ',
      );
    if (!types.includes(this.args.type)) {
      console.error(
        `${
          this.args.type
        } not supported type for Carbon::Tag, supported are:${types.join(',')}`,
      );
    }
    return this.args.type;
  }

  <template>
    <div class='cds--tag cds--tag--{{this.type}}' ...attributes>
      {{yield}}
    </div>
  </template>
}
