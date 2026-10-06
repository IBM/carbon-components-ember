import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import RadioButtonGroup from './group.gts';

// Carbon React has no stories of its own for RadioButtonGroup: it's a
// subcomponent of Components/RadioButton. See that page for the parity gaps
// (no `helperText`, `invalid` or `warn` on the group).

const meta = preview.meta({
  title: 'Components/RadioButton/RadioButtonGroup',
  component: RadioButtonGroup,
  parameters: {
    docs: {
      description: {
        component:
          'A `<fieldset>` that groups mutually exclusive `RadioButton`s. It yields a `RadioButton` already wired to the group: the group owns the shared `name`, the selection (`@defaultSelected`, or `@valueSelected` to control it) and reports changes through `@onChange`. The legend is `@legendText`, or the `heading` block for richer content. See `RadioButton` for the buttons themselves.',
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
    name: 'radio-button-group-default',
    defaultSelected: 'radio-2',
    orientation: 'horizontal',
    labelPosition: 'right',
    disabled: false,
    readOnly: false,
    required: false,
    onChange: fn(),
  },
  render: (args) => <template>
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
      <Radio @labelText="Radio button label" @value="radio-1" />
      <Radio @labelText="Radio button label" @value="radio-2" />
      <Radio @labelText="Radio button label" @value="radio-3" />
    </RadioButtonGroup>
  </template>,
});

export const Default = meta.story();

Default.test(
  'reports the selected value and the group name',
  async ({ canvas, userEvent, args }) => {
    await expect(
      canvas.getByRole('group', { name: 'Radio Button group' }),
    ).toBeVisible();
    const [first, second] = canvas.getAllByRole('radio');
    await expect(second).toBeChecked();

    await userEvent.click(first!);
    await expect(first).toBeChecked();
    await expect(second).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'radio-1',
      'radio-button-group-default',
      expect.anything(),
    );
  },
);
