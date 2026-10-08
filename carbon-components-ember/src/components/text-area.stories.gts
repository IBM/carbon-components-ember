import { trackedObject } from '@ember/reactive/collections';
import type { Decorator } from 'ember-storybook';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Add from './icons/add.ts';
import Layer from './layer.gts';
import TextArea from './text-area.gts';
import TextAreaSkeleton from './text-area-skeleton.gts';

import type { TextAreaSignature } from './text-area.gts';

type Args = TextAreaSignature['Args'];

// Carbon React parity gaps (Components/TextArea):
// - `withAILabel`: TextArea takes a `decorator` component (shown in
//   `WithDecorator`), but there is no AILabel component to pass to it yet
//   (#406).

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

const disabledContrast = {
  a11y: {
    config: {
      // WCAG 1.4.3 exempts inactive components from contrast minimums;
      // axe can't tell the disabled field's texts are inactive.
      rules: [{ id: 'color-contrast', enabled: false }],
    },
  },
};

// No `render`: TextArea takes no blocks, so every arg is passed straight
// through as a named argument.
const meta = preview.meta({
  title: 'Components/TextArea',
  component: TextArea,
  subcomponents: { TextAreaSkeleton },
  parameters: {
    docs: {
      description: {
        component:
          'TextArea allows the user to enter multiple lines of text.\n\nPass `@defaultValue` for an uncontrolled field, or `@value` with `@onChange` to control it; `@onChange` receives the new value and the event.',
      },
    },
  },
  argTypes: {
    counterMode: { control: 'inline-radio', options: ['character', 'word'] },
  },
  args: {
    labelText: 'Text Area label',
    helperText: 'TextArea helper text',
    placeholder: 'Placeholder text',
    rows: 4,
    maxCount: 500,
    onChange: fn(),
  },
});

export const Default = meta.story({
  args: {
    enableCounter: true,
  },
});

Default.test(
  'reports typed text and counts characters',
  async ({ canvas, userEvent, args }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Text Area label' });
    await userEvent.type(textarea, 'Hello{Enter}world');
    await expect(textarea).toHaveValue('Hello\nworld');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'Hello\nworld',
      expect.anything(),
    );
    await expect(canvas.getByText('11/500')).toBeInTheDocument();
  },
);

export const WithLayer = meta.story({
  args: {
    helperText: 'Optional helper text',
  },
  decorators: [withLayer],
});

export const WithDecorator = meta.story({
  args: {
    labelText: 'With a decorator',
    helperText: 'Optional helper text',
    decorator: Add,
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Experimental**: `@decorator` (or the deprecated `@slug`) renders a component inside the TextArea, such as an AILabel once it is available ([#406](https://github.com/IBM/carbon-components-ember/issues/406)). Any component can be used in the meantime; this example uses an icon as a stand-in.',
      },
    },
  },
});

export const Skeleton = meta.story({
  render: () => <template><TextAreaSkeleton /></template>,
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
      <TextArea
        @labelText={{args.labelText}}
        @helperText={{args.helperText}}
        @rows={{args.rows}}
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

export const WordCounter = meta.story({
  args: {
    labelText: 'With a word counter',
    enableCounter: true,
    maxCount: 20,
    counterMode: 'word',
    helperText: 'Up to 20 words',
  },
});

WordCounter.test('counts words', async ({ canvas, userEvent }) => {
  await userEvent.type(
    canvas.getByRole('textbox', { name: 'With a word counter' }),
    'one two three',
  );
  await expect(canvas.getByText('3/20')).toBeInTheDocument();
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
  parameters: disabledContrast,
});

export const ReadOnly = meta.story({
  args: {
    labelText: 'Read-only',
    readOnly: true,
    value: 'Read-only value',
  },
});

export const FixedSize = meta.story({
  args: {
    labelText: 'Fixed size',
    cols: 50,
    rows: 6,
    helperText: 'Not resizable horizontally',
  },
});
