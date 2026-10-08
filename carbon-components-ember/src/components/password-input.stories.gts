import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import PasswordInput from './password-input.gts';

import type { PasswordInputSignature } from './password-input.gts';

type Args = PasswordInputSignature['Args'];

// Carbon React parity: Components/PasswordInput only has a `Default`
// story, mirrored here. Gaps: no `decorator`/`slug`, `autoComplete` or
// `onTogglePasswordVisibility` that can cancel the toggle.

const meta = preview.meta({
  title: 'Components/PasswordInput',
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component:
          'PasswordInput allows the user to enter a single line of text that is masked by default, with a toggle button to reveal or hide the value.\n\nPass `@defaultValue` for an uncontrolled field, or `@value` with `@onChange` to control it. `@type="text"` starts with the value shown.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    type: { control: 'inline-radio', options: ['password', 'text'] },
    tooltipPosition: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
    tooltipAlignment: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
    },
  },
  args: {
    labelText: 'Password',
    helperText: 'Use at least 8 characters',
    placeholder: 'Enter your password',
    hidePasswordLabel: 'Hide password',
    showPasswordLabel: 'Show password',
    size: 'md',
    onChange: fn(),
    onTogglePasswordVisibility: fn(),
  },
  decorators: [
    // Leave room for the visibility toggle's tooltip.
    (Story, context) => <template>
      <div style="width: 300px; padding-bottom: 3rem">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
});

export const Default = meta.story();

Default.test(
  'masks the value until it is revealed',
  async ({ canvasElement, userEvent, args }) => {
    const input = canvasElement.querySelector('input')!;
    await expect(input).toHaveAttribute('type', 'password');

    await userEvent.type(input, 'hunter22');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'hunter22',
      expect.anything(),
    );

    const toggle = canvasElement.querySelector<HTMLButtonElement>(
      '.cds--text-input--password__visibility__toggle',
    )!;
    await userEvent.click(toggle);
    await expect(input).toHaveAttribute('type', 'text');
    await expect(args.onTogglePasswordVisibility).toHaveBeenCalledOnce();

    await userEvent.click(toggle);
    await expect(input).toHaveAttribute('type', 'password');
  },
);

export const Controlled = meta.story({
  args: {
    labelText: 'Controlled',
    helperText: undefined,
    value: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `@value`, the field shows exactly that value; the story keeps it in tracked state and updates it from `@onChange`.',
      },
    },
  },
  render: (args: Args) => {
    const state = trackedObject({ value: args.value });
    const onChange = (value: string, event: Event) => {
      state.value = value;
      args.onChange?.(value, event);
    };

    return <template>
      <PasswordInput
        @labelText={{args.labelText}}
        @value={{state.value}}
        @onChange={{onChange}}
      />
      <p>value: {{state.value}}</p>
    </template>;
  },
});

Controlled.test(
  'reflects the typed value',
  async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.type(canvasElement.querySelector('input')!, 'secret');
    await expect(canvas.getByText('value: secret')).toBeInTheDocument();
  },
);

export const ExtraSmall = meta.story({
  args: {
    labelText: 'Extra small',
    size: 'xs',
  },
});

export const Small = meta.story({
  args: {
    labelText: 'Small',
    size: 'sm',
  },
});

export const Large = meta.story({
  args: {
    labelText: 'Large',
    size: 'lg',
  },
});

export const Invalid = meta.story({
  args: {
    labelText: 'Invalid',
    invalid: true,
    invalidText: 'A valid password is required',
  },
});

export const Warning = meta.story({
  args: {
    labelText: 'Warning',
    warn: true,
    warnText: 'This password may cause issues',
  },
});

export const Disabled = meta.story({
  args: {
    labelText: 'Disabled',
    disabled: true,
    value: "Can't touch this",
  },
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive components from contrast minimums;
        // axe can't tell the disabled field's texts are inactive.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

export const ReadOnly = meta.story({
  args: {
    labelText: 'Read-only',
    readOnly: true,
    value: 'Read-only value',
  },
});

export const Inline = meta.story({
  args: {
    labelText: 'Inline',
    inline: true,
    helperText: 'Optional help text',
  },
});

export const CustomToggleLabels = meta.story({
  args: {
    labelText: 'Custom toggle labels',
    showPasswordLabel: 'Reveal password',
    hidePasswordLabel: 'Conceal password',
  },
});

export const VisibleByDefault = meta.story({
  args: {
    labelText: 'Visible by default',
    type: 'text',
    helperText: 'Starts with the value shown',
  },
});

VisibleByDefault.test('starts unmasked', async ({ canvasElement }) => {
  await expect(canvasElement.querySelector('input')).toHaveAttribute(
    'type',
    'text',
  );
});
