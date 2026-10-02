import { RenderStory } from 'ember-storybook';

import Tooltip from './tooltip.gts';

import type { Meta, StoryObj } from 'ember-storybook';

export default {
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
} satisfies Meta;

export const Default: StoryObj = {};

export const Open: StoryObj = {
  args: {
    defaultOpen: true,
  },
};

export const AlignTop: StoryObj = {
  args: {
    align: 'top',
    defaultOpen: true,
  },
};
