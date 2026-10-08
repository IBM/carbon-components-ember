import type { TOC } from '@ember/component/template-only';

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
