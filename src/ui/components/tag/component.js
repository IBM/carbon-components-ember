import Component from '@ember/component';

export default class extends Component {
  tagName = '';
  get type() {
    return this._type;
  }
  set type(v) {
    const types = [
      'ibm',
      'beta',
      'third-party',
      'local',
      'dedicated',
      'custom',
      'experimental',
      'community',
      'private'
    ];
    if (!types.includes(v)) {
      console.error(`${v} not supported type for Carbon::Tag, supported are:${types.join(',')}`);
    }
    this._type = v;
  }
}
