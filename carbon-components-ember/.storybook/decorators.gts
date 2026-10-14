import { RenderStory } from 'ember-storybook';

import Layer from '../src/components/layer.gts';

import type { Decorator } from 'ember-storybook';
import '#storybook/styles/decorators.css';

// Renders the story on the background and on two nested layers, like
// Carbon React's `WithLayer` story template.
export const withLayer: Decorator = (Story, context) => <template>
  <div class="decorators-story__padded">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
  <Layer
    @withBackground={{true}}
    class="decorators-story__padded"
    as |NextLayer|
  >
    <RenderStory @story={{Story}} @args={{context.args}} />
    <NextLayer @withBackground={{true}} class="decorators-story__next-layer">
      <RenderStory @story={{Story}} @args={{context.args}} />
    </NextLayer>
  </Layer>
</template>;
