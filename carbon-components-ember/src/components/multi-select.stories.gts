import { RenderStory } from 'ember-storybook';
import { expect, fn, waitFor } from 'storybook/test';

import { tracked } from '@glimmer/tracking';
import { withLayer } from '#storybook/decorators.gts';
import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import FilterableMultiSelect from './filterable-multi-select.gts';
import MultiSelect from './multi-select.gts';

import type {
  MultiSelectChange,
  MultiSelectSignature,
} from './multi-select.gts';
import '#storybook/styles/multi-select.css';

// Carbon React parity gaps (Components/MultiSelect):
// - No `translateWithId` or (on FilterableMultiSelect) `inputProps`, and no
//   `downshiftProps`, as neither is built on downshift; a block renders each
//   item instead of `itemToElement`.
// - Each item's checkbox is drawn rather than a real input, since an
//   option's children can't be interactive.

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
  isSelectAll?: boolean;
  searchTerms?: string[];
}

const items: Item[] = [
  { id: 'downshift-1-item-0', text: 'Option 1' },
  { id: 'downshift-1-item-1', text: 'Option 2' },
  {
    id: 'downshift-1-item-2',
    text: 'Option 3 - a disabled item',
    disabled: true,
  },
  { id: 'downshift-1-item-3', text: 'Option 4' },
  {
    id: 'downshift-1-item-4',
    text: 'An example option that is really long to show what should be done to handle long text',
  },
  { id: 'downshift-1-item-5', text: 'Option 5' },
];

const itemsWithSelectAll: Item[] = [
  { id: 'downshift-1-item-0', text: 'Editor' },
  { id: 'downshift-1-item-1', text: 'Owner' },
  { id: 'downshift-1-item-2', text: 'Uploader' },
  {
    id: 'downshift-1-item-3',
    text: 'Reader - a disabled item',
    disabled: true,
  },
  { id: 'select-all', text: 'All roles', isSelectAll: true },
];

const itemToString = (item: Item) => item.text;

// MultiSelect is generic over its item type, which signature inference
// can't follow, so declare the story's args explicitly.
type StoryArgs = MultiSelectSignature<Item>['Args'] & {
  // FilterableMultiSelect's.
  placeholder?: string;
};

const labelFor = ({ selectedItems }: MultiSelectChange<Item>) =>
  selectedItems.length === 1
    ? 'Option selected'
    : selectedItems.length > 1
      ? 'Options selected'
      : 'Choose options';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/MultiSelect',
  component: MultiSelect,
  subcomponents: { FilterableMultiSelect },
  parameters: {
    a11y: {
      // WCAG 1.4.3 exempts inactive components from contrast minimums; axe
      // can't tell a disabled item is inactive.
      context: { exclude: ['.cds--list-box__menu-item[disabled]'] },
    },
    docs: {
      description: {
        component:
          "`MultiSelect` is a field that opens a listbox of checkable items, for choosing any number of them. Like Carbon React's, it's built on the ListBox parts and follows downshift's keyboard model: focus stays on the field while the arrow keys move the highlight, Space or Enter checks the highlighted item, and the menu stays open until Escape, Tab or a click elsewhere. A tag in the field counts the items chosen and clears them; so do Delete and Escape on the closed field.\n\nItems can be any value: `@itemToString` turns one into its text (by default, a string or number item itself, or an object's string `label`). An item with `disabled: true` can't be chosen, and one with `isSelectAll: true` checks or clears every other item. The menu lists items by text, with the selection first once it reopens; `@selectionFeedback`, `@sortItems` and `@compareItems` change that.",
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    type: { control: 'inline-radio', options: ['default', 'inline'] },
    direction: { control: 'inline-radio', options: ['top', 'bottom'] },
    selectionFeedback: {
      control: 'inline-radio',
      options: ['top', 'fixed', 'top-after-reopen'],
    },
  },
  args: {
    titleText: 'Label',
    label: 'This is a label',
    helperText: 'This is helper text',
    invalidText: 'Error message goes here',
    warnText: 'Warning message goes here',
    items,
    itemToString,
    selectionFeedback: 'top-after-reopen',
    onChange: fn(),
    onMenuChange: fn(),
  },
  // Leave room for the open menu.
  decorators: [
    (Story, context) => <template>
      <div class="multi-select-story__container">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: StoryArgs) => <template>
    <MultiSelect
      @titleText={{args.titleText}}
      @label={{args.label}}
      @helperText={{args.helperText}}
      @items={{args.items}}
      @itemToString={{args.itemToString}}
      @initialSelectedItems={{args.initialSelectedItems}}
      @selectionFeedback={{args.selectionFeedback}}
      @autoAlign={{args.autoAlign}}
      @direction={{args.direction}}
      @size={{args.size}}
      @type={{args.type}}
      @hideLabel={{args.hideLabel}}
      @useTitleInItem={{args.useTitleInItem}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      @onChange={{args.onChange}}
      @onMenuChange={{args.onMenuChange}}
    />
  </template>,
});

export const Default = meta.story();

Default.test(
  'checks items, and keeps the menu open',
  async ({ canvas, userEvent, args }) => {
    const field = canvas.getByRole('combobox', { name: /^Label/ });
    await userEvent.click(field);
    await expect(field).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(canvas.getByRole('option', { name: 'Option 2' }));
    await userEvent.click(canvas.getByRole('option', { name: 'Option 4' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      selectedItems: [items[1], items[3]],
    });
    await expect(field).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByTitle('Clear selected items')).toBeVisible();
  },
);

Default.test(
  'can be used with the keyboard',
  async ({ canvas, userEvent, args }) => {
    const field = canvas.getByRole('combobox', { name: /^Label/ });
    field.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}{Escape}');
    await expect(args.onChange).toHaveBeenLastCalledWith({
      selectedItems: [items[0]],
    });
    await expect(field).toHaveAttribute('aria-expanded', 'false');

    await userEvent.keyboard('{Delete}');
    await expect(args.onChange).toHaveBeenLastCalledWith({
      selectedItems: [],
    });
  },
);

export const WithInitialSelectedItems = meta.story({
  args: {
    initialSelectedItems: [items[0]!, items[1]!],
  },
});

export const WithLayerMultiSelect = Default.extend({
  decorators: [withLayer],
});

export const Controlled = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Pass `@selectedItems` to control the selection yourself, and update it from `@onChange`. `@initialSelectedItems` seeds the selection for the uncontrolled case instead.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const selected = tracked<Item[]>(
      args.items.filter((item) => item.id === 'downshift-1-item-0'),
    );
    const onChange = (data: MultiSelectChange<Item>) => {
      selected.value = data.selectedItems;
      args.onChange?.(data);
    };
    const selectAll = () => {
      selected.value = args.items.filter((item) => !item.disabled);
    };
    const clear = () => {
      selected.value = [];
    };

    return <template>
      <MultiSelect
        @titleText={{args.titleText}}
        @label={{args.label}}
        @items={{args.items}}
        @itemToString={{args.itemToString}}
        @selectedItems={{selected.value}}
        @selectionFeedback={{args.selectionFeedback}}
        @onChange={{onChange}}
      />
      <div class="cds--btn-set multi-select-story__controls">
        <Button {{on "click" selectAll}}>Select all</Button>
        <Button @type="secondary" {{on "click" clear}}>Clear</Button>
      </div>
    </template>;
  },
});

Controlled.test(
  'follows a selection made from outside',
  async ({ canvas, userEvent }) => {
    await expect(canvas.getByTitle('Clear selected item')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Select all' }));
    await waitFor(() =>
      expect(canvas.getByTitle('Clear selected items')).toBeVisible(),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await waitFor(() =>
      expect(canvas.queryByTitle(/Clear selected/)).not.toBeInTheDocument(),
    );
  },
);

export const SelectAll = meta.story({
  args: {
    items: itemsWithSelectAll,
  },
  parameters: {
    docs: {
      description: {
        story:
          'An item with `isSelectAll: true` checks every enabled item, or clears the selection, and shows a partial selection as indeterminate. `@onChange` never includes it.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const label = tracked('Choose options');
    const onChange = (data: MultiSelectChange<Item>) => {
      label.value = labelFor(data);
      args.onChange?.(data);
    };

    return <template>
      <MultiSelect
        @titleText={{args.titleText}}
        @label={{label.value}}
        @helperText={{args.helperText}}
        @items={{args.items}}
        @itemToString={{args.itemToString}}
        @selectionFeedback={{args.selectionFeedback}}
        @onChange={{onChange}}
      />
    </template>;
  },
});

SelectAll.test(
  'checks every enabled item',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: /^Label/ }));
    await userEvent.click(canvas.getByRole('option', { name: 'All roles' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      selectedItems: itemsWithSelectAll.slice(0, 3),
    });
    await expect(
      canvas.getByRole('option', { name: 'All roles' }),
    ).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(canvas.getByRole('option', { name: 'Owner' }));
    await expect(
      canvas.getByRole('option', { name: 'All roles' }),
    ).toHaveAttribute('aria-checked', 'mixed');
  },
);

export const SelectAllWithDynamicItems = meta.story({
  args: {
    items: itemsWithSelectAll,
  },
  render: (args: StoryArgs) => {
    const label = tracked('Choose options');
    const list = tracked(args.items);
    const onChange = (data: MultiSelectChange<Item>) => {
      label.value = labelFor(data);
      args.onChange?.(data);
    };
    let added = 0;
    const addItems = () => {
      added += 2;
      list.value = [
        ...list.value,
        { id: `added-${added - 1}`, text: `Item added ${added - 1}` },
        { id: `added-${added}`, text: `Item added ${added}` },
      ];
    };

    return <template>
      <MultiSelect
        @titleText={{args.titleText}}
        @label={{label.value}}
        @helperText={{args.helperText}}
        @items={{list.value}}
        @itemToString={{args.itemToString}}
        @selectionFeedback={{args.selectionFeedback}}
        @onChange={{onChange}}
      />
      <Button {{on "click" addItems}}>Add 2 items to the list</Button>
    </template>;
  },
});

export const WithAILabel = meta.story({
  render: (args: StoryArgs) => <template>
    <MultiSelect
      @titleText={{args.titleText}}
      @label={{args.label}}
      @helperText={{args.helperText}}
      @items={{args.items}}
      @itemToString={{args.itemToString}}
      @onChange={{args.onChange}}
    >
      <:decorator as |AILabel|>
        <AILabel @align="bottom-end" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </MultiSelect>
  </template>,
});

export const ExperimentalAutoAlign = meta.story({
  args: {
    autoAlign: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Experimental:** with `@autoAlign`, Floating UI positions the menu: it opens above the field when there is no room below, and hides when the field scrolls out of view. Scroll the field towards the bottom of the viewport and open it.',
      },
    },
  },
  decorators: [
    (Story, context) => <template>
      <div class="multi-select-story__auto-align">
        <div class="multi-select-story__spacer-above"></div>
        <RenderStory @story={{Story}} @args={{context.args}} />
        <div class="multi-select-story__spacer-below"></div>
      </div>
    </template>,
  ],
});

ExperimentalAutoAlign.test(
  'positions the open menu as wide as the field',
  async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: /^Label/ }));
    const menu = canvasElement.querySelector<HTMLElement>(
      '.cds--list-box__menu',
    )!;
    const field = canvasElement.querySelector('.cds--multi-select')!;
    await waitFor(() => expect(menu.style.position).toBe('fixed'));
    await expect(menu.style.width).toBe(`${field.clientWidth}px`);
  },
);

const customSearchItems: Item[] = [
  { id: 'custom-search-item-0', text: 'Apple', searchTerms: ['fruit', 'red'] },
  {
    id: 'custom-search-item-1',
    text: 'Orange',
    searchTerms: ['fruit', 'orange'],
  },
  {
    id: 'custom-search-item-2',
    text: 'Broccoli',
    searchTerms: ['vegetable', 'green'],
  },
];

const renderFilterable = (args: StoryArgs) => <template>
  <FilterableMultiSelect
    @titleText={{args.titleText}}
    @placeholder={{args.placeholder}}
    @helperText={{args.helperText}}
    @items={{args.items}}
    @itemToString={{args.itemToString}}
    @selectionFeedback={{args.selectionFeedback}}
    @autoAlign={{args.autoAlign}}
    @direction={{args.direction}}
    @size={{args.size}}
    @type={{args.type}}
    @hideLabel={{args.hideLabel}}
    @useTitleInItem={{args.useTitleInItem}}
    @disabled={{args.disabled}}
    @readOnly={{args.readOnly}}
    @invalid={{args.invalid}}
    @invalidText={{args.invalidText}}
    @warn={{args.warn}}
    @warnText={{args.warnText}}
    @onChange={{args.onChange}}
    @onMenuChange={{args.onMenuChange}}
  />
</template>;

// FilterableMultiSelect has no `label` or `clearAnnouncement`, so their
// controls are hidden, as in Carbon React.
const filterableControls = { exclude: ['label', 'clearAnnouncement'] };

export const Filterable = meta.story({
  parameters: {
    controls: filterableControls,
    docs: {
      description: {
        story:
          '`FilterableMultiSelect` adds a text input that narrows the items: by default to those whose text contains what was typed, or as `@filterItems` says. Focus stays in the input, so typing filters while the arrow keys and Enter choose items. Delete, Escape, or Backspace in the empty input clear the closed field.',
      },
    },
  },
  render: renderFilterable,
});

Filterable.test(
  'filters the items, and checks the one chosen',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: /^Label/ });
    await userEvent.type(input, 'option 4');
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith({
      selectedItems: [items[3]],
    });
    await expect(input).toHaveValue('option 4');
  },
);

export const FilterableWithSelectAll = meta.story({
  args: {
    items: itemsWithSelectAll,
  },
  parameters: {
    controls: filterableControls,
    docs: {
      description: {
        story:
          'With a select-all item, `FilterableMultiSelect` checks or clears the items the text typed lists, and keeps the rest of the selection.',
      },
    },
  },
  render: renderFilterable,
});

FilterableWithSelectAll.test(
  'checks only the items listed',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: /^Label/ });
    await userEvent.type(input, 'own');
    await userEvent.click(canvas.getByRole('option', { name: 'All roles' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      selectedItems: [itemsWithSelectAll[1]],
    });
  },
);

export const FilterableWithCustomSearch = meta.story({
  args: {
    titleText: 'Filter by category or color',
    helperText: 'Try searching for "fruit" or "green"',
    items: customSearchItems,
  },
  parameters: {
    controls: filterableControls,
    docs: {
      description: {
        story:
          'To search elsewhere, here on terms the items carry, pass a `@filterItems` that keeps the items as they are, and change `@items` from `@onInputValueChange`.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const results = tracked(args.items);
    const keepItems = (list: readonly Item[]) => [...list];
    const search = ({ inputValue }: { inputValue: string }) => {
      const query = inputValue.trim().toLocaleLowerCase();
      results.value = query
        ? args.items.filter((item) =>
            item.searchTerms?.some((term) => term.includes(query)),
          )
        : args.items;
    };

    return <template>
      <FilterableMultiSelect
        @titleText={{args.titleText}}
        @helperText={{args.helperText}}
        @items={{results.value}}
        @itemToString={{args.itemToString}}
        @filterItems={{keepItems}}
        @onInputValueChange={{search}}
        @onChange={{args.onChange}}
      />
    </template>;
  },
});

FilterableWithCustomSearch.test(
  'lists what the search finds',
  async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole('combobox', { name: /^Filter by category/ }),
      'green',
    );
    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(1));
    await expect(
      canvas.getByRole('option', { name: 'Broccoli' }),
    ).toBeVisible();
  },
);

export const FilterableWithLayer = Filterable.extend({
  decorators: [withLayer],
});

export const FilterableWithAILabel = meta.story({
  parameters: { controls: filterableControls },
  render: (args: StoryArgs) => <template>
    <FilterableMultiSelect
      @titleText={{args.titleText}}
      @helperText={{args.helperText}}
      @items={{args.items}}
      @itemToString={{args.itemToString}}
      @onChange={{args.onChange}}
    >
      <:decorator as |AILabel|>
        <AILabel @align="bottom-end" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </FilterableMultiSelect>
  </template>,
});
