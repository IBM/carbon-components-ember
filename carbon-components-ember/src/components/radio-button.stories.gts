import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import RadioButton from './radio-button.gts';
import RadioButtonGroup from './radio-button/group.gts';

import type { RadioButtonGroupSignature as GroupSignature } from './radio-button/group.gts';
import type { Value } from './radio-button.gts';

// Carbon React parity gaps (Components/RadioButton):
// - RadioButtonGroup has no `helperText`, `invalid`/`invalidText` or
//   `warn`/`warnText` (React's `Default` story exposes all of them).
// - `Skeleton`: there is no RadioButtonSkeleton.
// - `withAILabel`: no `decorator`/`slug` arg.

// The stories render a RadioButtonGroup; `hideLabel` is passed on to each
// RadioButton.
type StoryArgs = GroupSignature['Args'] & { hideLabel?: boolean };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/RadioButton',
  component: RadioButton,
  subcomponents: { RadioButtonGroup },
  parameters: {
    docs: {
      description: {
        component:
          'Radio buttons are used when there is a list of two or more options that are mutually exclusive and the user must select exactly one choice.\n\nRender them through a `RadioButtonGroup`, which yields a `RadioButton` already wired to the group: the group owns the shared `name`, the selection (`@defaultSelected`, or `@valueSelected` to control it) and reports changes through `@onChange`. A RadioButton can also be used on its own with `@checked`/`@defaultChecked`.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    labelPosition: { control: 'inline-radio', options: ['left', 'right'] },
  },
  args: {
    legendText: 'Radio Button group',
    name: 'radio-button-default-group',
    defaultSelected: 'radio-2',
    hideLabel: false,
    onChange: fn(),
  },
  render: (args: StoryArgs) => <template>
    <RadioButtonGroup
      @legendText={{args.legendText}}
      @name={{args.name}}
      @orientation={{args.orientation}}
      @labelPosition={{args.labelPosition}}
      @defaultSelected={{args.defaultSelected}}
      @valueSelected={{args.valueSelected}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @required={{args.required}}
      @onChange={{args.onChange}}
      as |Radio|
    >
      <Radio
        @labelText="Radio button label"
        @value="radio-1"
        @hideLabel={{args.hideLabel}}
      />
      <Radio
        @labelText="Radio button label"
        @value="radio-2"
        @hideLabel={{args.hideLabel}}
      />
      <Radio
        @labelText="Radio button label"
        @value="radio-3"
        @hideLabel={{args.hideLabel}}
      />
    </RadioButtonGroup>
  </template>,
});

export const Default = meta.story();

Default.test(
  'selects one option at a time',
  async ({ canvas, userEvent, args }) => {
    const [first, second, third] = canvas.getAllByRole('radio');
    await expect(second).toBeChecked();

    await userEvent.click(third!);
    await expect(third).toBeChecked();
    await expect(second).not.toBeChecked();
    await expect(first).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'radio-3',
      'radio-button-default-group',
      expect.anything(),
    );
  },
);

export const Vertical = meta.story({
  args: {
    legendText: 'Group label',
    name: 'radio-button-vertical-group',
    defaultSelected: 'radio-1',
    orientation: 'vertical',
  },
  render: (args: StoryArgs) => <template>
    <RadioButtonGroup
      @legendText={{args.legendText}}
      @name={{args.name}}
      @defaultSelected={{args.defaultSelected}}
      @orientation={{args.orientation}}
      @onChange={{args.onChange}}
      as |Radio|
    >
      <Radio @labelText="Radio button label" @value="radio-1" />
      <Radio @labelText="Radio button label" @value="radio-2" />
      <Radio
        @labelText="Radio button label"
        @value="radio-3"
        @disabled={{true}}
      />
    </RadioButtonGroup>
  </template>,
});

Vertical.test('skips the disabled option', async ({ canvas }) => {
  await expect(canvas.getAllByRole('radio')[2]).toBeDisabled();
});

export const DefaultChecked = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          '`@defaultChecked` on a yielded RadioButton seeds the group selection too.',
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <RadioButtonGroup
      @legendText="Radio button group"
      @onChange={{args.onChange}}
      as |Radio|
    >
      <Radio
        @value="option-1"
        @defaultChecked={{true}}
        @labelText="Option 1 is default"
      />
      <Radio @value="option-2" @labelText="Option 2" />
    </RadioButtonGroup>
    <br />
    <RadioButtonGroup
      @legendText="Vertical group"
      @orientation="vertical"
      @onChange={{args.onChange}}
      as |Radio|
    >
      <Radio
        @value="option-1"
        @defaultChecked={{true}}
        @labelText="Vertical option 1 is default"
      />
      <Radio @value="option-2" @labelText="Option 2" />
    </RadioButtonGroup>
  </template>,
});

export const CustomHeading = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'The `heading` block replaces `@legendText` when the legend needs markup.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject<{ selected?: Value }>({});
    const onChange = (
      value: Value | undefined,
      name: string | undefined,
      event: Event,
    ) => {
      state.selected = value;
      args.onChange?.(value, name, event);
    };

    return <template>
      <RadioButtonGroup @onChange={{onChange}} @orientation="vertical">
        <:heading>Radio button group with a <em>custom</em> heading</:heading>
        <:default as |Radio|>
          <Radio @value="a" @labelText="Option A" />
          <Radio @value="b" @labelText="Option B" />
        </:default>
      </RadioButtonGroup>
      <p>selected: {{state.selected}}</p>
    </template>;
  },
});

CustomHeading.test('reports the selection', async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('radio', { name: 'Option B' }));
  await expect(canvas.getByText('selected: b')).toBeInTheDocument();
});

export const Standalone = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A RadioButton outside a group: `@checked` controls it and `@onChange` fires when it gets selected.',
      },
    },
  },
  render: () => {
    const state = trackedObject({ checked: false });
    const onChange = () => {
      state.checked = true;
    };

    return <template>
      <RadioButton @checked={{false}} @labelText="radio" />
      <br />
      <RadioButton @checked={{true}} @labelText="radio is checked" />
      <br />
      <RadioButton
        @checked={{state.checked}}
        @onChange={{onChange}}
        @labelText="click me"
      />
      <br />
      is checked:
      {{state.checked}}
      <br />
      <RadioButton @disabled={{true}} @labelText="disabled" />
    </template>;
  },
});

Standalone.test(
  'checks the controlled radio',
  async ({ canvas, userEvent }) => {
    const radio = canvas.getByRole('radio', { name: 'click me' });
    await userEvent.click(radio);
    await expect(radio).toBeChecked();
    await expect(canvas.getByText('is checked: true')).toBeInTheDocument();
  },
);
