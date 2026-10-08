import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FluidTextInput from './fluid-text-input.gts';
import FluidTextInputSkeleton from './fluid-text-input-skeleton.gts';
import Information from './icons/information.ts';
import Toggletip from './toggletip.gts';
import ToggletipLabel from './toggletip/label.gts';

import type { FluidTextInputSignature } from './fluid-text-input.gts';

type Args = FluidTextInputSignature['Args'];

// Carbon React parity gaps (Components/Fluid Components/FluidTextInput):
// - `DefaultWithToggletip`: the `labelText` block renders inside the
//   `<label>`, so the toggletip ends up in the label (React keeps it next
//   to the label, since interactive content is invalid in labels).

const meta = preview.meta({
  title: 'Components/Fluid Components/FluidTextInput',
  component: FluidTextInput,
  parameters: {
    docs: {
      description: {
        component:
          'FluidTextInput is a text input variant with fluid styling - a full-width bottom divider and inline validation message, intended for use in fluid forms.\n\nPass `@defaultValue` for an uncontrolled field, or `@value` with `@onChange` to control it. `@isPassword` masks the value and adds a visibility toggle. The `labelText` block replaces `@labelText` when the label needs markup.',
      },
    },
  },
  args: {
    labelText: 'Label',
    placeholder: 'Placeholder text',
    maxCount: 500,
    invalidText:
      'Error message that is really long can wrap to more lines but should not be excessively long.',
    warnText:
      'Warning message that is really long can wrap to more lines but should not be excessively long.',
    onChange: fn(),
  },
  decorators: [
    (Story, context) => <template>
      <div style="width: 400px">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
});

export const Default = meta.story();

Default.test(
  'reports typed text through onChange',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Label' });
    await userEvent.type(input, 'Hello');
    await expect(input).toHaveValue('Hello');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'Hello',
      expect.anything(),
    );
  },
);

export const DefaultWithToggletip = meta.story({
  render: (args: Args) => <template>
    <FluidTextInput
      @placeholder={{args.placeholder}}
      @onChange={{args.onChange}}
    >
      <:labelText>
        <ToggletipLabel>Label</ToggletipLabel>
        <Toggletip @align="top-start" as |t|>
          <t.Button @label="Show information">
            <Information />
          </t.Button>
          <t.Content>
            <p>Additional field information here.</p>
          </t.Content>
        </Toggletip>
      </:labelText>
    </FluidTextInput>
  </template>,
});

DefaultWithToggletip.test(
  'opens the toggletip',
  async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show information' }),
    );
    await expect(
      await canvas.findByText('Additional field information here.'),
    ).toBeVisible();
  },
);

export const Controlled = meta.story({
  args: {
    labelText: 'Controlled',
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
      <FluidTextInput
        @labelText={{args.labelText}}
        @value={{state.value}}
        @onChange={{onChange}}
      />
      <p>value: {{state.value}}</p>
    </template>;
  },
});

Controlled.test('reflects the typed value', async ({ canvas, userEvent }) => {
  await userEvent.type(
    canvas.getByRole('textbox', { name: 'Controlled' }),
    'Hi there',
  );
  await expect(canvas.getByText('value: Hi there')).toBeInTheDocument();
});

export const WithCounter = meta.story({
  args: {
    labelText: 'With a counter',
    enableCounter: true,
    maxCount: 20,
  },
});

WithCounter.test('counts characters', async ({ canvas, userEvent }) => {
  await userEvent.type(
    canvas.getByRole('textbox', { name: 'With a counter' }),
    'Hello',
  );
  await expect(canvas.getByText('5/20')).toBeInTheDocument();
});

export const Invalid = meta.story({
  args: {
    labelText: 'Invalid',
    invalid: true,
    invalidText: 'A valid value is required',
  },
});

export const Warning = meta.story({
  args: {
    labelText: 'Warning',
    warn: true,
    warnText: 'This value may cause issues',
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

export const Password = meta.story({
  args: {
    labelText: 'Password',
    isPassword: true,
    placeholder: 'Enter your password',
    onTogglePasswordVisibility: fn(),
  },
});

Password.test('reveals the password', async ({ canvas, userEvent, args }) => {
  const toggle = canvas.getByRole('button', { name: 'Show password' });
  await userEvent.click(toggle);
  await expect(args.onTogglePasswordVisibility).toHaveBeenCalledOnce();
  await expect(
    canvas.getByRole('button', { name: 'Hide password' }),
  ).toBeInTheDocument();
  await expect(
    canvas.getByRole('textbox', { name: 'Password' }),
  ).toHaveAttribute('type', 'text');
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`FluidTextInputSkeleton` stands in for the component while its content loads.',
      },
    },
  },
  render: () => <template><FluidTextInputSkeleton /></template>,
});
