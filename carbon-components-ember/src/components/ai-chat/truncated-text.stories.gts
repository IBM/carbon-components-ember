import { RenderStory } from 'ember-storybook';
import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import AiChatTruncatedText from './truncated-text.gts';

// Mirrors `@carbon/ai-chat-components`' `truncated-text.stories.js`
// (`Default`, `Expand`). Exported from the addon as `AiChatTruncatedText`
// (a plain `TruncatedText` would collide with Carbon React's component of
// that name).
//
// docs-app coverage: its single demo rendered the tooltip (default) and
// expand modes, both clamped to 2 lines in a 20rem column - covered by
// `Default` and `Expand`.
//
// Parity gaps: upstream picks the layered toggle style by sniffing for a
// `cds-layer` ancestor; the Ember port exposes it as the `@isLayered` arg
// instead.

const meta = preview.meta({
  title: 'AI Chat/Truncated text',
  component: AiChatTruncatedText,
  parameters: {
    docs: {
      description: {
        component: [
          '`AiChatTruncatedText` clamps text (or arbitrary block content) to a maximum number of `@lines`, revealing the rest via a tooltip (`@type="tooltip"`, the default) or an inline expand/collapse toggle (`@type="expand"`).',
          '',
          "Pass `@value` for plain text, or a block for rich content — the tooltip variant's label always uses `@value`, matching upstream.",
        ].join('\n'),
      },
    },
  },
  args: {
    align: 'top',
    autoalign: false,
    collapseLabel: 'Show less',
    expandLabel: 'Show more',
    lines: 2,
    type: 'tooltip',
    value:
      'This is a long piece of text that demonstrates how truncated text reveals overflow content in a tooltip.',
  },
  decorators: [
    (Story, context) => <template>
      <div style="max-width: 20rem; padding: 3rem 0 1rem;">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args) => <template>
    <AiChatTruncatedText
      @align={{args.align}}
      @autoalign={{args.autoalign}}
      @collapseLabel={{args.collapseLabel}}
      @expandLabel={{args.expandLabel}}
      @id={{args.id}}
      @lines={{args.lines}}
      @type={{args.type}}
      @value={{args.value}}
      @isLayered={{args.isLayered}}
    />
  </template>,
});

export const Default = meta.story({
  args: {
    id: 'truncated-text-default',
  },
});

Default.test(
  'reveals the full text in a tooltip on hover',
  async ({ canvasElement, userEvent, args }) => {
    // The tooltip wrapper only renders once the content is measured as
    // overflowing.
    await waitFor(() =>
      expect(canvasElement.querySelector('.cds--tooltip')).not.toBeNull(),
    );
    const content = canvasElement.querySelector<HTMLElement>(
      '#truncated-text-default',
    )!;
    await userEvent.hover(content);
    await waitFor(() =>
      expect(canvasElement.querySelector('.cds--tooltip')).toHaveClass(
        'cds--popover--open',
      ),
    );
    await expect(
      canvasElement.querySelector('[role="tooltip"]'),
    ).toHaveTextContent(args.value!);
  },
);

export const Expand = meta.story({
  args: {
    id: 'truncated-text-expand',
    type: 'expand',
  },
});

Expand.test(
  'expands and collapses with the toggle',
  async ({ canvas, canvasElement, userEvent }) => {
    const showMore = await canvas.findByRole('button', { name: 'Show more' });
    await expect(showMore).toHaveAttribute(
      'aria-controls',
      'truncated-text-expand',
    );

    await userEvent.click(showMore);
    const showLess = await canvas.findByRole('button', { name: 'Show less' });
    // Component bug: the toggle binds a raw boolean to aria-expanded, which
    // renders as aria-expanded="" when expanded (and no attribute when
    // collapsed) rather than "true"/"false" - so assert the expanded state
    // through the content instead.
    await expect(
      canvasElement.querySelector('#truncated-text-expand'),
    ).toHaveClass('cds-aichat-truncated-text__content--expanded');

    // Keyboard activation works too.
    showLess.focus();
    await userEvent.keyboard('{Enter}');
    await expect(
      await canvas.findByRole('button', { name: 'Show more' }),
    ).toBeInTheDocument();
    await expect(
      canvasElement.querySelector('#truncated-text-expand'),
    ).not.toHaveClass('cds-aichat-truncated-text__content--expanded');
  },
);
