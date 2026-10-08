import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import CopyButton from './copy-button.gts';

import type { CopyButtonSignature } from './copy-button.gts';

// Carbon React parity: Components/CopyButton only has a `Default` story,
// which this file mirrors. React's CopyButton has no text to copy of its
// own (it only fires `onClick`); this one copies its block (or
// `@targetElement`/`@targetElementId`) to the clipboard itself.

// `code` isn't one of CopyButton's args: it's the text yielded into the
// button's block, which is what gets copied. `render` is annotated so the
// story-only arg is part of the inferred args.
type StoryArgs = CopyButtonSignature['Args'] & { code: string };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/CopyButton',
  component: CopyButton,
  parameters: {
    docs: {
      description: {
        component:
          '`CopyButton` is an icon-only button that copies text to the clipboard and shows a "Copied!" tooltip as feedback. It is used internally by `CodeSnippet`, but can also be used on its own — pass the text to copy as the block content, or point it at another element via `@targetElement`/`@targetElementId`.',
      },
    },
  },
  // Leave room for the tooltip so it stays inside the canvas.
  decorators: [
    (Story, context) => <template>
      <div style="padding: 3rem">
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
    code: "console.log('hello world');",
    onClick: fn(),
  },
  render: (args: StoryArgs) => <template>
    <CopyButton
      @align={{args.align}}
      @autoAlign={{args.autoAlign}}
      @disabled={{args.disabled}}
      @feedback={{args.feedback}}
      @feedbackTimeout={{args.feedbackTimeout}}
      @iconDescription={{args.iconDescription}}
      @onClick={{args.onClick}}
    >{{args.code}}</CopyButton>
  </template>,
});

export const Default = meta.story();

Default.test(
  'copies and shows the feedback label',
  async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Copy to clipboard' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(button).toHaveAccessibleName('Copied!');
  },
);

export const CustomFeedback = meta.story({
  args: {
    iconDescription: 'Duplicate',
    feedback: 'Duplicated!',
    feedbackTimeout: 1000,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`@iconDescription` sets the accessible name and tooltip label shown before a copy, defaulting to `'Copy to clipboard'`. `@feedback` sets the tooltip label shown after a copy, defaulting to `'Copied!'`, and `@feedbackTimeout` controls how long (in ms) it stays visible before reverting, defaulting to `2000`.",
      },
    },
  },
});

CustomFeedback.test(
  'uses the custom labels and reverts after the timeout',
  async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Duplicate' });
    await userEvent.click(button);
    await expect(button).toHaveAccessibleName('Duplicated!');
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await expect(button).toHaveAccessibleName('Duplicate');
  },
);

export const AlignTop = meta.story({
  args: {
    align: 'top',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`@align` and `@autoAlign` behave the same as on `Popover`/`Tooltip`.',
      },
    },
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

Disabled.test('cannot be clicked', async ({ canvas }) => {
  await expect(
    canvas.getByRole('button', { name: 'Copy to clipboard' }),
  ).toBeDisabled();
});
