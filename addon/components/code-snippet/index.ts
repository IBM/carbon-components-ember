import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../../decorators';

type Args = {
  type: 'default'|'multiline'|'inline'
}

export default class CarbonCodeSnippet extends Component<Args> {
  @tracked expanded = false;

  args = defaultArgs(this, {
    type: 'default'
  })
}
