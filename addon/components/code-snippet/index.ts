import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../../decorators';

type Args = {
  type: 'default'|'multiline'|'inline'
}

export interface CarbonCodeSnippetSignature {
  Args: Args;
  Blocks: {
    default: []
  }
}

export default class CarbonCodeSnippet extends Component<CarbonCodeSnippetSignature> {
  @tracked expanded = false;
  codeElement: Element;
  carbonElement: Element;

  @defaultArgs
  args: Args = {
    type: 'default'
  }
}
