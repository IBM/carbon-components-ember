import { trackedObject } from '@ember/reactive/collections';
import type { Decorator } from 'ember-storybook';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import TextInput from './text-input.gts';

import type { TextInputSignature } from './text-input.gts';

type Args = TextInputSignature['Args'];

// Carbon React parity gaps (Components/TextInput):
// - `Inline`: no `inline` arg.
// - `withAILabel`: no `decorator`/`slug` arg.
// - `Skeleton`: there is no TextInputSkeleton.
// - No `labelText` as a node, `xs` size or `TestInvalidTextNoOverlap`
//   visual-regression story. PasswordInput and FluidTextInput are their own
//   components with their own stories.

// Renders the story on the background and on two nested layers, like
// Carbon React's `WithLayer` story template.
const withLayer: Decorator = (Story, context) => <template>
  <div style="padding: 1rem">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
  <Layer @withBackground={{true}} style="padding: 1rem" as |NextLayer|>
    <RenderStory @story={{Story}} @args={{context.args}} />
    <NextLayer @withBackground={{true}} style="padding: 1rem; margin-top: 1rem">
      <RenderStory @story={{Story}} @args={{context.args}} />
    </NextLayer>
  </Layer>
</template>;

// No `render`: TextInput takes no blocks, so every arg is passed straight
// through as a named argument (`@labelText`, `@placeholder`, ...).
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
