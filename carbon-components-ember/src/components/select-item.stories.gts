import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import SelectItem from './select-item.gts';
import SelectItemGroup from './select-item-group.gts';

// Carbon React has no stories of its own for SelectItem: it's a
// subcomponent of Components/Select, a native `<select>`. This addon's
// Select is a custom listbox, so SelectItem is shown inside a plain native
// `<select>` here.

const meta = preview.meta({
  title: 'Components/SelectItem',
  component: SelectItem,
  parameters: {
    docs: {
      description: {
        component:
          '`SelectItem` renders a native `<option>` element for use inside a native `<select>`. Group options with `SelectItemGroup`.',
      },
    },
  },
  args: {
    value: 'option-2',
    text: 'Option 2',
  },
  render: (args) => <template>
    <div class="cds--form-item">
      <div class="cds--select">
        <label for="select-item-story" class="cds--label">Select</label>
        <div class="cds--select-input__wrapper">
          <select id="select-item-story" class="cds--select-input">
            <SelectItem @value="option-1" @text="Option 1" />
            <SelectItem
              @value={{args.value}}
              @text={{args.text}}
              @disabled={{args.disabled}}
              @hidden={{args.hidden}}
            />
            <SelectItem @value="option-3" @text="Option 3" />
          </select>
        </div>
      </div>
    </div>
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
    <div class="cds--form-item">
      <div class="cds--select">
        <label for="select-item-grouped-story" class="cds--label">
          Select
        </label>
        <div class="cds--select-input__wrapper">
          <select id="select-item-grouped-story" class="cds--select-input">
            <SelectItemGroup @label="Group 1">
              <SelectItem @value="option-1" @text="Option 1" />
              <SelectItem @value="option-2" @text="Option 2" />
            </SelectItemGroup>
            <SelectItemGroup @label="Group 2" @disabled={{true}}>
              <SelectItem @value="option-3" @text="Option 3" />
              <SelectItem @value="option-4" @text="Option 4" />
            </SelectItemGroup>
          </select>
        </div>
      </div>
    </div>
  </template>,
});
