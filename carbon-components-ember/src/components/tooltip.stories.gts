import { RenderStory } from 'ember-storybook';

import preview from '#storybook/preview.ts';
import Tooltip from './tooltip.gts';

const meta = preview.meta({
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    label: 'Occasionally, services are updated in a specified time window.',
    align: 'bottom',
  },
  // Leave room around the trigger so the popover stays inside the canvas.
  decorators: [
    (Story, context) => <template>
      <div style="padding: 4rem 8rem">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args) => <template>
    <Tooltip
      @label={{args.label}}
      @align={{args.align}}
      @defaultOpen={{args.defaultOpen}}
      @highContrast={{args.highContrast}}
      @dropShadow={{args.dropShadow}}
    >
      <button class="cds--btn cds--btn--primary" type="button">
        Hover or focus me
      </button>
    </Tooltip>
  </template>,
});

export const Default = meta.story();

export const Open = meta.story({
  args: {
    defaultOpen: true,
  },
});

export const AlignTop = meta.story({
  args: {
    align: 'top',
    defaultOpen: true,
  },
});
