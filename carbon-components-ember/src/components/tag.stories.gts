import { trackedObject } from '@ember/reactive/collections';
import { expect, fn as spy } from 'storybook/test';
import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import DismissibleTag from './dismissible-tag.gts';
import OperationalTag from './operational-tag.gts';
import Popover from './popover.gts';
import SelectableTag from './selectable-tag.gts';
import Tag from './tag.gts';
import TagSkeleton from './tag-skeleton.gts';
import Asleep from './icons/asleep.ts';

import type { DismissibleTagSignature } from './dismissible-tag.gts';
import type { OperationalTagSignature } from './operational-tag.gts';
import type { TagSignature } from './tag.gts';
import '#storybook/styles/tag.css';

// Parity gaps with Carbon React's Tag stories:
// - No `filter` arg: Carbon React deprecates it for DismissibleTag.
// - React moves `tabIndex` to the tooltip's trigger while the label is cut
//   off; a `tabindex` attribute here stays on the tag.

const TYPES: TagSignature['Args']['type'][] = [
  'red',
  'magenta',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
  'gray',
  'cool-gray',
  'warm-gray',
  'high-contrast',
  'outline',
];

// `label` isn't one of Tag's args: it's the text the story yields into the
// tag's block. `preview.type()` replaces the inferred args rather than adding
// to them, so spell out Tag's own args too.
type StoryArgs = TagSignature['Args'] & {
  label: string;
  dismissTooltipAlignment?: DismissibleTagSignature['Args']['dismissTooltipAlignment'];
  onChange?: (selected: boolean) => void;
  onClose?: (event: MouseEvent) => void;
};

const OPERATIONAL_TYPES: OperationalTagSignature['Args']['type'][] = [
  'red',
  'magenta',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
  'gray',
  'cool-gray',
  'warm-gray',
];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Tag',
  component: Tag,
  subcomponents: { DismissibleTag, OperationalTag, SelectableTag },
  parameters: {
    docs: {
      description: {
        component:
          "Tags label, categorize or organize items with a keyword or two. `@type` picks the color, `@size` the size (`sm`, `md` or `lg`), and `@renderIcon` adds an icon. A label too long for the tag is cut off and shows in a tooltip on a press or focus, as in Carbon React. With `@href`, or `@route` (plus `@models` and `@query`) for one of the app's routes, the tag's icon and label are a link, and a cut-off label gets no tooltip. Its `<:decorator>` block takes an AI label.\n\nThree interactive tags take their text as `@text`: `DismissibleTag` has a button that calls `@onClose`, for applied filters; `OperationalTag` is a button, with its handler in `{{on \"click\"}}`; and `SelectableTag` toggles, calling `@onChange` with whether it's selected (`@selected` wins over its own state, which `@defaultSelected` starts).",
      },
    },
  },
  args: {
    label: 'Tag content',
    type: 'gray',
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args: StoryArgs) => <template>
    <Tag
      @type={{args.type}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @renderIcon={{args.renderIcon}}
    >
      {{args.label}}
    </Tag>
  </template>,
});

export const Default = meta.story({
  args: {
    type: 'gray',
  },
});

export const Blue = meta.story({
  args: {
    type: 'blue',
  },
});

export const Small = meta.story({
  args: {
    type: 'purple',
    size: 'sm',
  },
});

export const Disabled = meta.story({
  args: {
    type: 'teal',
    disabled: true,
  },
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive components from contrast minimums;
        // axe can't tell a disabled tag (a <div>) is inactive.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

// One tag of every type; the first one's label is cut off.
export const ReadOnly = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'One tag of every type. The first label is too long for its tag, so it is cut off and shows in a tooltip on a press or focus.',
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <div>
      {{#each TYPES as |type index|}}
        <Tag @type={{type}} @size={{args.size}} @disabled={{args.disabled}}>
          {{if index args.label "Tag content with a long text description"}}
        </Tag>
      {{/each}}
    </div>
  </template>,
});

// `@size` supports `sm`, `md` (default) or `lg`.
export const Sizes = meta.story({
  render: () => <template>
    <Tag @type="blue" @size="sm">Small</Tag>
    <Tag @type="blue" @size="md">Medium</Tag>
    <Tag @type="blue" @size="lg">Large</Tag>
  </template>,
});

// Ember-only: with `@href`, or `@route` for one of the app's routes, the
// tag's icon and label are a link.
export const AsALink = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "With `@href`, or `@route` (plus `@models` and `@query`) for one of the app's routes, the tag's icon and label are a link. A decorator stays outside the link, so its button isn't nested in it.",
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <Tag @type={{args.type}} @size={{args.size}} @href="#">
      <:default>{{args.label}}</:default>
      <:decorator as |AILabel|>
        <AILabel @align="bottom-start" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </Tag>
  </template>,
});

// `@renderIcon` renders an icon inside the tag. The icon is hidden for the
// `sm` size.
export const WithIcon = meta.story({
  args: {
    type: 'blue',
    label: 'With icon',
    renderIcon: Asleep,
  },
});

// **Experimental:** Tag's and DismissibleTag's `<:decorator>` block yields an
// `AILabel` already sized for the tag (small and inline); a Tag's text then
// goes in `<:default>`.
export const WithAILabel = meta.story({
  args: {
    label: 'Tag content',
  },
  argTypes: { type: { control: false } },
  render: (args: StoryArgs) => <template>
    <div class="tag-story__group tag-story__ai-label">
      <Tag @size={{args.size}} @title="Clear Filter" @type="red">
        <:default>{{args.label}}</:default>
        <:decorator as |AILabel|>
          <AILabel @align="bottom-start" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
      </Tag>
      <DismissibleTag
        @size={{args.size}}
        @text={{args.label}}
        @title="Clear Filter"
        @type="purple"
      >
        <:decorator as |AILabel|>
          <AILabel @align="bottom-start" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
      </DismissibleTag>
      <Tag
        @renderIcon={{Asleep}}
        @size={{args.size}}
        @title="Clear Filter"
        @type="blue"
      >
        <:default>{{args.label}}</:default>
        <:decorator as |AILabel|>
          <AILabel @align="bottom-start" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
      </Tag>
      <DismissibleTag
        @renderIcon={{Asleep}}
        @size={{args.size}}
        @text={{args.label}}
        @title="Clear Filter"
        @type="green"
      >
        <:decorator as |AILabel|>
          <AILabel @align="bottom-start" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
      </DismissibleTag>
    </div>
  </template>,
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`TagSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments.',
      },
    },
  },
  render: () => <template><TagSkeleton /></template>,
});

const SELECTABLE = [
  { id: 1, text: 'Tag content with a long text description' },
  { id: 2, text: 'Tag content 1' },
  { id: 3, text: 'Tag content 2' },
  { id: 4, text: 'Tag content 3' },
];

export const Selectable = meta.story({
  args: { disabled: false, onChange: spy() },
  argTypes: { type: { control: false }, label: { control: false } },
  parameters: {
    docs: {
      description: {
        story:
          '`SelectableTag` toggles on a press and calls `@onChange` with whether it is selected. Here the story keeps the selection, passing it back as `@selected`.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ selected: [2] as number[] });
    const isSelected = (id: number) => state.selected.includes(id);
    const change = (id: number, selected: boolean) => {
      state.selected = selected
        ? [...state.selected, id]
        : state.selected.filter((other) => other !== id);
      args.onChange?.(selected);
    };

    return <template>
      <div class="tag-story__group" aria-label="Selectable tags" role="group">
        {{#each SELECTABLE as |tag|}}
          <SelectableTag
            @disabled={{args.disabled}}
            @onChange={{fn change tag.id}}
            @renderIcon={{Asleep}}
            @selected={{isSelected tag.id}}
            @size={{args.size}}
            @text={{tag.text}}
          />
        {{/each}}
      </div>
    </template>;
  },
});

Selectable.test(
  'a press selects a tag and calls onChange',
  async ({ canvas, userEvent, args }) => {
    const tag = canvas.getByRole('button', { name: 'Tag content 2' });
    await expect(tag).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(tag);

    await expect(tag).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
);

export const Operational = meta.story({
  args: { disabled: false, size: 'md' },
  argTypes: { type: { control: false }, label: { control: false } },
  parameters: {
    docs: {
      description: {
        story:
          '`OperationalTag` is a button, so a tag can open more, such as a popover listing other tags. Its handler goes on it with `{{on "click"}}`, and a `Popover`\'s `trigger` modifier too.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: false, openHighContrast: false });
    const toggle = () => {
      state.openHighContrast = false;
      state.open = !state.open;
    };
    const toggleHighContrast = () => {
      state.open = false;
      state.openHighContrast = !state.openHighContrast;
    };
    const close = () => (state.open = false);
    const closeHighContrast = () => (state.openHighContrast = false);

    return <template>
      <div
        class="tag-story__group tag-story__operational"
        aria-label="Operational tags"
        role="group"
      >
        {{#each OPERATIONAL_TYPES as |type index|}}
          <OperationalTag
            @disabled={{args.disabled}}
            @renderIcon={{Asleep}}
            @size={{args.size}}
            @text={{if
              index
              "Tag content"
              "Tag content with a long text description"
            }}
            @type={{type}}
          />
        {{/each}}
      </div>

      <h4>Interactive examples</h4>
      <div
        class="tag-story__group tag-story__popovers"
        aria-label="Operational tags with Popover"
        role="group"
      >
        <Popover
          @highContrast={{true}}
          @onRequestClose={{closeHighContrast}}
          @open={{state.openHighContrast}}
          as |PopoverContent trigger|
        >
          <OperationalTag
            @disabled={{args.disabled}}
            @renderIcon={{Asleep}}
            @size={{args.size}}
            @text="Tag content"
            aria-expanded={{if state.openHighContrast "true" "false"}}
            {{on "click" toggleHighContrast}}
            {{trigger}}
          />
          <PopoverContent class="tag-story__popover-content">
            <p>Tag 1 name</p>
            <p>Tag 2 name</p>
            <p>Tag 3 name</p>
            <p>Tag 4 name</p>
            <p>Tag 5 name</p>
          </PopoverContent>
        </Popover>
        <Popover
          @onRequestClose={{close}}
          @open={{state.open}}
          as |PopoverContent trigger|
        >
          <OperationalTag
            @disabled={{args.disabled}}
            @renderIcon={{Asleep}}
            @size={{args.size}}
            @text="Tag content"
            aria-expanded={{if state.open "true" "false"}}
            {{on "click" toggle}}
            {{trigger}}
          />
          <PopoverContent>
            <div class="tag-story__group tag-story__group--column">
              <Tag @size={{args.size}} @type="blue">Tag 1 name</Tag>
              <Tag @size={{args.size}} @type="blue">Tag 2 name</Tag>
              <Tag @size={{args.size}} @type="blue">Tag 3 name</Tag>
              <Tag @size={{args.size}} @type="blue">Tag 4 name</Tag>
              <Tag @size={{args.size}} @type="blue">Tag 5 name</Tag>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </template>;
  },
});

const DISMISSIBLE: {
  type: TagSignature['Args']['type'];
  text: string;
  tagTitle?: string;
}[] = [
  {
    type: 'red',
    text: 'Tag content with a long text description',
    tagTitle: 'Provide a custom title to the tag',
  },
  ...TYPES.slice(1).map((type, index) => ({
    type,
    text: `Tag content ${index + 1}`,
  })),
];

export const Dismissible = meta.story({
  args: {
    disabled: false,
    size: 'md',
    dismissTooltipAlignment: 'bottom',
    onClose: spy(),
  },
  argTypes: {
    type: { control: false },
    label: { control: false },
    dismissTooltipAlignment: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "`DismissibleTag`'s button calls `@onClose`; the tag stays until the caller removes it, as this story does. Reset brings them all back.",
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ tags: DISMISSIBLE });
    const dismiss = (tag: (typeof DISMISSIBLE)[number], event: MouseEvent) => {
      state.tags = state.tags.filter((other) => other !== tag);
      args.onClose?.(event);
    };
    const reset = () => (state.tags = DISMISSIBLE);

    return <template>
      <Button class="tag-story__reset" {{on "click" reset}}>Reset</Button>
      <div class="tag-story__group" aria-label="Dismissible tags" role="group">
        {{#each state.tags as |tag|}}
          <DismissibleTag
            @disabled={{args.disabled}}
            @dismissTooltipAlignment={{args.dismissTooltipAlignment}}
            @onClose={{fn dismiss tag}}
            @renderIcon={{Asleep}}
            @size={{args.size}}
            @tagTitle={{tag.tagTitle}}
            @text={{tag.text}}
            @title="Dismiss"
            @type={{tag.type}}
          />
        {{/each}}
      </div>
    </template>;
  },
});

Dismissible.test(
  'a dismiss button calls onClose and the story removes its tag',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const tags = () => canvasElement.querySelectorAll('.cds--tag--filter');
    await expect(tags()).toHaveLength(12);

    const tag = canvas.getByText('Tag content 1').closest('.cds--tag')!;
    await userEvent.click(tag.querySelector('.cds--tag__close-icon')!);

    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(tags()).toHaveLength(11);
    await expect(canvas.queryByText('Tag content 1')).toBeNull();
  },
);
