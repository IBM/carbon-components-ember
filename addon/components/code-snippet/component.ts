import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CodeSnippet from 'carbon-components/es/components/code-snippet/code-snippet';
import { defaultArgs } from '../../decorators';

type Args = {
  type: 'default'|'multiline'|'inline'
}

export default class CarbonCodeSnippet extends Component<Args> {
  carbonComponent: any;
  @tracked carbonElement = null;

  args = defaultArgs({
    type: 'default'
  })


  @action
  loadCarbonComponent(carbonElement) {
    if (this.args.type === 'inline') return;
    this.carbonComponent = new CodeSnippet(carbonElement, this.args);
  }

  @action
  destroyCarbonComponent() {
    return this.carbonComponent && this.carbonComponent.release();
  }
}
