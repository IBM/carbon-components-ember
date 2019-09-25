import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { CodeSnippet } from 'carbon-components';

export default class CarbonCodeSnippet extends Component {
  carbonElement = null;
  tagName = '';
  @tracked attrs;
  @tracked type = 'default';

  @action
  loadCarbonComponent() {
    if (!this.carbonElement) {
      return;
    }
    if (this.type === 'inline') return;
    this.carbonComponent = new CodeSnippet(this.carbonElement, this.attrs);
  }

  @action
  destroyCarbonComponent() {
    return this.carbonComponent && this.carbonComponent.release();
  }
}
