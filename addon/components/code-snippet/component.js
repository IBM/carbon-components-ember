import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CodeSnippet from 'carbon-components/es/components/code-snippet/code-snippet';
import { defaultArgs } from '../../decorators';

export default class CarbonCodeSnippet extends Component {
  @tracked carbonElement = null;

  @defaultArgs
  args = {
    type: 'default'
  }


  @action
  loadCarbonComponent() {
    if (!this.carbonElement) {
      return;
    }
    if (this.args.type === 'inline') return;
    this.carbonComponent = new CodeSnippet(this.carbonElement, this.args);
  }

  @action
  destroyCarbonComponent() {
    return this.carbonComponent && this.carbonComponent.release();
  }
}
