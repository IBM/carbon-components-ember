import Component from '@glimmer/component';

export default class ListHeaderComponent extends Component {
  didSetup = false;
  table = null;

  constructor(...args) {
    super(...args);
    if (this.args.table) {
      this.table = this.args.table;
      this.didSetup = true;
      Object.defineProperty(this.args.table, 'headers', {
        configurable: true,
        get: () => this.args.headers
      });
      Object.defineProperty(this.args.table, 'isExpandable', {
        configurable: true,
        get: () => this.args.isExpandable
      });
      Object.defineProperty(this.args.table, 'isCheckable', {
        configurable: true,
        get: () => this.args.isCheckable
      });
    }
  }
}
