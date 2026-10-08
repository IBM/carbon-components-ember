import { RenderStory } from 'ember-storybook';

import Layer from '../src/components/layer.gts';

import type { Decorator } from 'ember-storybook';

// Renders the story on the background and on two nested layers, like
// Carbon React's `WithLayer` story template.
export const withLayer: Decorator = (Story, context) => <template>
  <div style="padding: 1rem">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
  <Layer @withBackground={{true}} style="padding: 1rem" as |NextLayer|>
    <RenderStory @story={{Story}} @args={{context.args}} />
    <NextLayer @withBackground={{true}} style="padding: 1rem; margin-top: 1rem">
      <RenderStory @story={{Story}} @args={{context.args}} />
    </NextLayer>
  </Layer>
</template>;
