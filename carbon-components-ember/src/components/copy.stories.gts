import { RenderStory } from 'ember-storybook';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Copy from './copy.gts';
import CopyIcon from './icons/copy.ts';

import type { CopySignature } from './copy.gts';
import '#storybook/styles/copy.css';

// Carbon React has no Copy stories; this page shows it on its own.

type StoryArgs = CopySignature['Args'] & {
  /** Story-only: called on click, through `{{on "click"}}`. */
  onClick: () => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Copy',
  component: Copy,
  parameters: {
    docs: {
      description: {
        component:
          '`Copy` is Carbon React\'s Copy: a button whose tooltip shows `@feedback` for `@feedbackTimeout` when it\'s clicked. `@ariaLabel` names it and is its tooltip until then. It copies nothing itself: copy in a click handler (`{{on "click"}}`), or use `CopyButton`, which copies. A click handler that prevents the default skips the feedback.',
      },
    },
  },
  // Leave room for the tooltip so it stays inside the canvas.
  decorators: [
    (Story, context) => <template>
      <div class="copy-story__padded">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  argTypes: {
    align: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
  },
  args: {
    ariaLabel: 'Copy to clipboard',
    align: 'bottom',
    autoAlign: false,
    disabled: false,
    feedback: 'Copied!',
    feedbackTimeout: 2000,
    onClick: fn(),
  },
  render: (args: StoryArgs) => <template>
    <Copy
      @ariaLabel={{args.ariaLabel}}
      @align={{args.align}}
      @autoAlign={{args.autoAlign}}
      @disabled={{args.disabled}}
      @feedback={{args.feedback}}
      @feedbackTimeout={{args.feedbackTimeout}}
      {{on "click" args.onClick}}
    >
      <CopyIcon />
    </Copy>
  </template>,
});

export const Default = meta.story();

Default.test(
  'shows the feedback when clicked',
  async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Copy to clipboard' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(button).toHaveAccessibleName('Copied!'));
  },
);
