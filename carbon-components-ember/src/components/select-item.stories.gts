import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Select from './select.gts';
import SelectItem from './select-item.gts';
import SelectItemGroup from './select-item-group.gts';

// Carbon React has no stories of its own for SelectItem: it's a
// subcomponent of Components/Select.

const meta = preview.meta({
  title: 'Components/SelectItem',
  component: SelectItem,
  parameters: {
    docs: {
      description: {
        component:
          '`SelectItem` renders a native `<option>` element. Use the one a `Select` yields (`<Select as |SelectItem|>`), and group options with `SelectItemGroup`.',
      },
    },
  },
  args: {
    value: 'option-2',
    text: 'Option 2',
  },
  render: (args) => <template>
    <Select as |SelectItem|>
      <SelectItem @value="option-1" @text="Option 1" />
      <SelectItem
        @value={{args.value}}
        @text={{args.text}}
        @disabled={{args.disabled}}
        @hidden={{args.hidden}}
      />
      <SelectItem @value="option-3" @text="Option 3" />
    </Select>
  </template>,
});

export const Default = meta.story();

Default.test('renders selectable options', async ({ canvas, userEvent }) => {
  const select = canvas.getByRole('combobox', { name: 'Select' });
  await userEvent.selectOptions(select, 'Option 2');
  await expect(select).toHaveValue('option-2');
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

Disabled.test('disables the option', async ({ canvas }) => {
  await expect(canvas.getByRole('option', { name: 'Option 2' })).toBeDisabled();
});

export const GroupedWithSelectItemGroup = meta.story({
  parameters: {
    docs: {
      description: {
        story: 'Wrap SelectItems in `SelectItemGroup`s to group them.',
      },
    },
  },
  render: () => <template>
    <Select as |SelectItem|>
      <SelectItemGroup @label="Group 1">
        <SelectItem @value="option-1" @text="Option 1" />
        <SelectItem @value="option-2" @text="Option 2" />
      </SelectItemGroup>
      <SelectItemGroup @label="Group 2" @disabled={{true}}>
        <SelectItem @value="option-3" @text="Option 3" />
        <SelectItem @value="option-4" @text="Option 4" />
      </SelectItemGroup>
    </Select>
  </template>,
});
