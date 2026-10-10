import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import { withLayer } from '#storybook/decorators.gts';
import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import TextInput from './text-input.gts';
import TextInputSkeleton from './text-input-skeleton.gts';

import type { TextInputSignature } from './text-input.gts';

type Args = TextInputSignature['Args'];

// Carbon React parity gaps (Components/TextInput):
// - `Inline`: no `inline` arg.
// - No `labelText` as a node, `xs` size or `TestInvalidTextNoOverlap`
//   visual-regression story. PasswordInput and FluidTextInput are their own
//   components with their own stories.

// No `render`: every arg is passed straight through as a named argument
// (`@labelText`, `@placeholder`, ...).
const meta = preview.meta({
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component:
          'TextInput allows the user to enter a single line of text.\n\nPass `@defaultValue` for an uncontrolled field, or `@value` with `@onChange` to control it; `@onChange` receives the new value and the event.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    labelText: 'Label',
    placeholder: 'Placeholder text',
    onChange: fn(),
  },
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

export const ReadOnly = meta.story({
  args: {
    defaultValue: "This is read only, you can't type more.",
    readOnly: true,
  },
});

ReadOnly.test('cannot be typed into', async ({ canvas, userEvent }) => {
  const input = canvas.getByRole('textbox', { name: 'Label' });
  await userEvent.type(input, 'more');
  await expect(input).toHaveValue("This is read only, you can't type more.");
});

export const WithLayer = meta.story({
  args: {
    helperText: 'Optional helper text',
  },
  decorators: [withLayer],
});

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
      <TextInput
        @labelText={{args.labelText}}
        @placeholder={{args.placeholder}}
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

export const WithHelperText = meta.story({
  args: {
    helperText: 'Optional helper text',
  },
});

export const Counter = meta.story({
  args: {
    defaultValue: 'Hi',
    enableCounter: true,
    maxCount: 20,
  },
});

export const Invalid = meta.story({
  args: {
    invalid: true,
    invalidText: 'Error message goes here',
  },
});

export const Warning = meta.story({
  args: {
    warn: true,
    warnText: 'Warning message goes here',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const WithAILabel = meta.story({
  render: (args: TextInputSignature['Args']) => <template>
    <TextInput
      @labelText={{args.labelText}}
      @hideLabel={{args.hideLabel}}
      @defaultValue={{args.defaultValue}}
      @placeholder={{args.placeholder}}
      @helperText={{args.helperText}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      @light={{args.light}}
      @onChange={{args.onChange}}
    >
      <:decorator as |AILabel|>
        <AILabel @align="bottom-end" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </TextInput>
  </template>,
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`TextInputSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments.',
      },
    },
  },
  render: () => <template><TextInputSkeleton /></template>,
});
