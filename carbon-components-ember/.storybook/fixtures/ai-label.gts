import Button from '../../src/components/button.gts';
import FolderOpen from '../../src/components/icons/folder-open.ts';
import Folders from '../../src/components/icons/folders.ts';
import View from '../../src/components/icons/view.ts';

import type { TOC } from '@ember/component/template-only';
import type { AILabelSignature } from '../../src/components/ai-label.gts';

import './ai-label.scss';

// The explanation Carbon React's AI label stories show in the label's content.
export const AIExplanation: TOC<object> = <template>
  <div class="ai-label-explanation">
    <p class="secondary">AI Explained</p>
    <p class="heading">84%</p>
    <p class="secondary bold">Confidence score</p>
    <p class="secondary">
      Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
    </p>
    <hr />
    <p class="secondary">Model type</p>
    <p class="bold">Foundation model</p>
  </div>
</template>;

// The content and actions Carbon React's AI label stories put in the label.
export const ExplainedLabel: TOC<{
  Args: { label: AILabelSignature['Blocks']['default'][0] };
}> = <template>
  <@label.Content>
    <AIExplanation />
    <@label.Actions>
      <Button @kind="ghost" @hasIconOnly={{true}} @iconDescription="View">
        <View />
      </Button>
      <Button
        @kind="ghost"
        @hasIconOnly={{true}}
        @iconDescription="Open Folder"
      >
        <FolderOpen />
      </Button>
      <Button @kind="ghost" @hasIconOnly={{true}} @iconDescription="Folders">
        <Folders />
      </Button>
      <Button>View details</Button>
    </@label.Actions>
  </@label.Content>
</template>;
