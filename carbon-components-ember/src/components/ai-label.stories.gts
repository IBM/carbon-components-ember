import { expect, fn } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import AILabel from './ai-label.gts';
import Button from './button.gts';
import FolderOpen from './icons/folder-open.ts';
import Folders from './icons/folders.ts';
import View from './icons/view.ts';

import type { AILabelSignature } from './ai-label.gts';

// Parity gaps with Carbon React's AILabel stories:
// - No `autoAlign`: Toggletip doesn't support it yet, so `@align` picks a
//   static position.
// - The revert button has no tooltip (React's IconButton shows its label);
//   `@revertLabel` names it for assistive technology.

const meta = preview.type<{ args: AILabelSignature['Args'] }>().meta({
  title: 'Components/AILabel',
  component: AILabel,
  parameters: {
    docs: {
      description: {
        component:
          'An AI label marks content that AI generated or influenced. Its button opens an explanation of how AI was used: put it in the yielded `Content`, with any buttons in `Actions`. Components such as Tag, TextArea, Dropdown and DatePickerInput take an AI label in their `<:decorator>` block, which yields an `AILabel` already sized for them.',
      },
    },
  },
  args: {
    aiText: 'AI',
    size: 'xs',
    kind: 'default',
    align: 'bottom',
    revertActive: false,
    onRevertClick: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', '2xs', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    kind: { control: 'inline-radio', options: ['default', 'inline'] },
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
  render: (args) => <template>
    <AILabel
      @aiText={{args.aiText}}
      @textLabel={{args.textLabel}}
      @kind={{args.kind}}
      @size={{args.size}}
      @align={{args.align}}
      @revertActive={{args.revertActive}}
      @revertLabel={{args.revertLabel}}
      @onRevertClick={{args.onRevertClick}}
      as |label|
    >
      <label.Content>
        <AIExplanation />
        <label.Actions>
          <Button @iconOnly={{true}} @ghost={{true}} aria-label="View">
            <View @size="16" />
          </Button>
          <Button @iconOnly={{true}} @ghost={{true}} aria-label="Open folder">
            <FolderOpen @size="16" />
          </Button>
          <Button @iconOnly={{true}} @ghost={{true}} aria-label="Folders">
            <Folders @size="16" />
          </Button>
          <Button>View details</Button>
        </label.Actions>
      </label.Content>
    </AILabel>
  </template>,
});

export const Default = meta.story();

Default.test(
  'opens the explanation from its button',
  async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'AI Show information' });
    await expect(button).toHaveClass(
      'cds--ai-label__button--xs',
      'cds--ai-label__button--default',
    );
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Confidence score')).toBeVisible();
  },
);

export const Inline = meta.story({
  args: {
    kind: 'inline',
    size: 'md',
  },
});

export const InlineWithContent = meta.story({
  args: {
    kind: 'inline',
    size: 'md',
    textLabel: 'Text goes here',
  },
});

InlineWithContent.test(
  'shows its text label next to the AI text',
  async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.cds--ai-label__button');
    await expect(button).toHaveClass(
      'cds--ai-label__button--inline-with-content',
    );
    await expect(button).toHaveTextContent('AI Text goes here');
  },
);

export const Revert = meta.story({
  args: {
    revertActive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Once the user changes AI-generated content, `@revertActive` swaps the label for a button that reverts to the AI input, calling `@onRevertClick`.',
      },
    },
  },
});

Revert.test('calls onRevertClick', async ({ canvas, userEvent, args }) => {
  await userEvent.click(
    canvas.getByRole('button', { name: 'Revert to AI input' }),
  );
  await expect(args.onRevertClick).toHaveBeenCalled();
});
