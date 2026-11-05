import preview from '#storybook/preview.ts';
import TruncatedText from './truncated-text.gts';
import { PopoverAlignments } from '../popover.gts';

import type { TruncatedTextSignature } from './truncated-text.gts';
import '#storybook/styles/ibm-products/truncated-text.css';

// Mirrors Carbon for IBM Products' TruncatedText stories.

const meta = preview.type<{ args: TruncatedTextSignature['Args'] }>().meta({
  title: 'IBM Products/Utilities/TruncatedText',
  component: TruncatedText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Text cut off after a number of lines, as Carbon for IBM Products' `TruncatedText`. Import it from `carbon-components-ember/ibm-products`. Give it the text as `@value` and the lines to show as `@lines` (2 by default). Once the text is cut off, the `tooltip` type, the default, shows all of it in a tooltip, and the `expand` type adds a toggle labelled `@expandLabel` and `@collapseLabel` that shows all of it in place.",
      },
    },
  },
  argTypes: {
    align: { control: 'select', options: PopoverAlignments },
    type: { control: 'select', options: ['tooltip', 'expand'] },
  },
  args: {
    align: 'top',
    autoAlign: false,
    collapseLabel: 'View less',
    expandLabel: 'View more',
    id: 'example-id',
    lines: 3,
    value:
      'Buttons are used to initialize an action, either in the background or foreground of an experience. There are several kinds of buttons. Primary buttons should be used for the principle call to action on the page. Secondary buttons should be used for secondary actions on each page. Danger buttons should be used for a negative action (such as Delete) on the page. Modify the behavior of the button by changing its event properties. Small buttons may be used when there is not enough space for a regular sized button. This issue is most found in tables. Small button should have three words or less. When words are not enough, icons can be used in buttons to better communicate what the button does. Icons are always paired with text.',
    type: 'tooltip',
  },
  render: (args: TruncatedTextSignature['Args']) => <template>
    <div class="ibm-products-truncated-text-story__viewport">
      <TruncatedText
        @align={{args.align}}
        @autoAlign={{args.autoAlign}}
        @collapseLabel={{args.collapseLabel}}
        @expandLabel={{args.expandLabel}}
        @id={{args.id}}
        @lines={{args.lines}}
        @type={{args.type}}
        @value={{args.value}}
      />
    </div>
  </template>,
});

export const WithTooltip = meta.story({});

export const WithExpand = meta.story({ args: { type: 'expand' } });
