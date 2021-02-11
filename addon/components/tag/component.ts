import Component from '@glimmer/component';

type Args = {
  type: 'red'|'magenta'|'purple'|'blue'|'cyan'|'teal'|'green'|'gray'|'cool-gray'|'warm-gray'
}

export default class TagComponent extends Component<Args> {
  get type() {
    const types = 'red magenta purple blue cyan teal green gray cool-gray warm-gray'.split(' ');
    if (!types.includes(this.args.type)) {
      console.error(`${this.args.type} not supported type for Carbon::Tag, supported are:${types.join(',')}`);
    }
    return this.args.type;
  }
}
