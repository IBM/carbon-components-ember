import { tracked } from '@glimmer/tracking';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import Send from '../icons/send.ts';
import PromptLine from './prompt-line.gts';
import PromptLineShell from './prompt-line-shell.gts';

import type { PromptLineShellSignature } from './prompt-line-shell.gts';

// `@carbon/ai-chat-components` has no stories of its own for
// `cds-aichat-prompt-line-shell`: the shell's variants (`rounded`,
// `expanded`, `hasError`, `disabled`) are args of its `Preview/Prompt line`
// stories (see `prompt-line.stories.gts`, which mirrors those, including
// the file-uploads and autocomplete compositions). These stories follow the
// docs-app page instead (its one demo is `Default`) and show each variant
// the shell itself expresses.
//
// Parity gaps: upstream's `cds-aichat-input-send-control` and
// `cds-aichat-error-message` aren't ported, so the send control is a plain
// icon-only `Button` and the error message is plain `<:fieldMessaging>`
// content. Upstream's `carbonTheme` arg isn't ported: the Storybook
// toolbar's theme switcher applies Carbon's theme classes instead.

type StoryArgs = PromptLineShellSignature['Args'] & {
  /** Story-only: the message shown in `<:fieldMessaging>` when `hasError` is set. */
  errorTitle?: string;
  /** Story-only: the host sent a message. */
  onSend: (text: string) => void;
};

class Conversation {
  @tracked content = '';
  @tracked messages: string[] = [];
  args: StoryArgs;

  constructor(args: StoryArgs) {
    this.args = args;
  }

  get sendDisabled() {
    return Boolean(this.args.disabled) || this.content.trim().length === 0;
  }

  onChange = (value: string) => {
    this.content = value;
  };

  send = () => {
    if (this.sendDisabled) {
      return;
    }
    const text = this.content.trim();
    this.messages = [...this.messages, text];
    this.content = '';
    this.args.onSend(text);
  };
}

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Prompt line shell',
  component: PromptLineShell,
  parameters: {
    docs: {
      description: {
        component:
          'Layout-only composer chrome for the chat input: `PromptLineShell` defines six named blocks (`<:editor>`, `<:messageActions>`, `<:fileUploads>`, `<:autocompleteContent>`, `<:fieldMessaging>`, `<:sendControl>`) and the spacing/border treatment around them. It carries no chat-domain logic and forwards no editor methods — compose a `PromptLine` (or your own editing surface) into `<:editor>`.\n\nSee **AI Chat/Prompt line** for compositions with message actions, file uploads and the autocomplete popup.',
      },
    },
  },
  argTypes: {
    errorTitle: { control: 'text' },
  },
  args: {
    rounded: true,
    expanded: false,
    hasError: false,
    disabled: false,
    errorTitle: 'Something went wrong.',
    onSend: fn(),
  },
  render: (args) => {
    const state = new Conversation(args);

    return <template>
      <ul aria-label="Sent messages" style="margin-block-end: 1rem;">
        {{#each state.messages as |message|}}
          <li>{{message}}</li>
        {{/each}}
      </ul>
      <PromptLineShell
        @rounded={{args.rounded}}
        @expanded={{args.expanded}}
        @hasError={{args.hasError}}
        @disabled={{args.disabled}}
        @hasFileUploads={{args.hasFileUploads}}
      >
        <:fieldMessaging>
          {{#if args.hasError}}
            <p
              role="alert"
              style="padding: 0.5rem 1rem; color: var(--cds-text-error, #da1e28);"
            >{{args.errorTitle}}</p>
          {{/if}}
        </:fieldMessaging>
        <:editor>
          <PromptLine
            @content={{state.content}}
            @placeholder="Type a message..."
            @disabled={{args.disabled}}
            @onChange={{state.onChange}}
            @onSendIntent={{state.send}}
          />
        </:editor>
        <:sendControl>
          <Tooltip @label="Send" @autoAlign={{true}}>
            <Button
              @type={{undefined}}
              @ghost={{true}}
              @size="sm"
              @iconOnly={{true}}
              @disabled={{state.sendDisabled}}
              @onClick={{state.send}}
              aria-label="Send"
            >
              <Send @size="16" />
            </Button>
          </Tooltip>
        </:sendControl>
      </PromptLineShell>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'composes a PromptLine whose messages are sent from the send control',
  async ({ canvas, userEvent, args }) => {
    const textbox = canvas.getByRole('textbox', { name: 'Message' });
    const send = canvas.getByRole('button', { name: 'Send' });
    await expect(send).toBeDisabled();

    await userEvent.type(textbox, 'First message');
    await userEvent.click(send);
    await userEvent.type(textbox, 'Second message{Enter}');

    await expect(args.onSend).toHaveBeenNthCalledWith(1, 'First message');
    await expect(args.onSend).toHaveBeenNthCalledWith(2, 'Second message');
    const items = canvas.getAllByRole('listitem');
    await expect(items.map((item) => item.textContent)).toEqual([
      'First message',
      'Second message',
    ]);
    await expect(textbox).toHaveValue('');
  },
);

export const Expanded = meta.story({
  args: {
    expanded: true,
  },
});

export const Square = meta.story({
  args: {
    rounded: false,
  },
});

export const WithError = meta.story({
  args: {
    hasError: true,
  },
});

WithError.test(
  'renders the field messaging and the error modifier',
  async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Something went wrong.',
    );
    await expect(
      canvasElement.querySelector('.cds-aichat-prompt-line-shell'),
    ).toHaveClass('cds-aichat-prompt-line-shell--has-error');
  },
);

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

Disabled.test(
  'disables the editor and the send control',
  async ({ canvas }) => {
    // PromptLine's textarea goes read-only rather than disabled.
    await expect(
      canvas.getByRole('textbox', { name: 'Message' }),
    ).toHaveAttribute('readonly');
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
  },
);
