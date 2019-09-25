import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class ListComponent extends Component {
  tagName = '';
  @tracked attrs;
}
