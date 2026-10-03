import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Link from './link.gts';
import TextInput from './text-input.gts';
import Tile from './tile.gts';
import TileGroup from './tile/tile-group.gts';

import type { Args as TileArgs } from './tile.gts';

// Parity gaps with Carbon React's Tile stories:
// - `DefaultWithLayer`, `ClickableWithLayer`, `RadioWithLayer`,
//   `ExpandableWithLayer`: there is no `WithLayer` story helper here.
// - `ClickableWithCustomIcon`: clickable tiles have no `renderIcon`, `href`
//   or `disabled` args (they always render `href="#"`).
// - Selectable tiles have no `selected`/`disabled`/`name`/`value` args; the
//   selection is internal state, reported through `@onSelect`.
// - Expandable tiles have no `expanded` arg (the state is internal), and no
//   `tileCollapsedIconText`/`tileExpandedIconText`/labels, `tileMaxHeight`,
//   `tilePadding` or `light`.
// - `withAILabel`: no AILabel / `decorator` support.

type Value = string | number;
type StoryArgs = TileArgs & { onChange?: (value: Value | undefined) => void };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Tile',
  component: Tile,
  parameters: {
    docs: {
      description: {
        component:
          'A tile is a highly flexible component for displaying a wide variety of content. `Tile` renders a default, `@clickable`, `@selectable` or `@expandable` tile; its `content`, `above` and `below` named blocks hold the content (`above`/`below` are the always-visible and expandable parts of an expandable tile). Use `TileGroup` together with its yielded `RadioTile` to build a group of tiles where only one tile can be selected at a time.',
      },
    },
  },
  args: {
    id: 'tile-1',
  },
});

export const Default = meta.story({
  render: (args: StoryArgs) => <template>
    <Tile @id={{args.id}}>
      <:content>
        Default tile
        <br />
        <br />
        <Link @href="https://www.carbondesignsystem.com">Link</Link>
      </:content>
    </Tile>
  </template>,
});

export const Clickable = meta.story({
  args: {
    onClick: fn(),
  },
  render: (args: StoryArgs) => <template>
    <Tile @clickable={{true}} @onClick={{args.onClick}}>
      <:content>Clickable Tile</:content>
    </Tile>
  </template>,
});

Clickable.test('calls onClick', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('link', { name: 'Clickable Tile' }));
  await expect(args.onClick).toHaveBeenCalledOnce();
});

export const Selectable = meta.story({
  args: {
    id: 'selectable-tile-1',
    onSelect: fn(),
  },
  render: (args: StoryArgs) => <template>
    <Tile @selectable={{true}} @id={{args.id}} @onSelect={{args.onSelect}}>
      <:content>Selectable</:content>
    </Tile>
  </template>,
});

Selectable.test(
  'toggles with click and keyboard',
  async ({ canvas, userEvent, args }) => {
    const tile = canvas.getByRole('checkbox', { name: 'Selectable' });
    await expect(tile).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(tile);
    await expect(tile).toHaveAttribute('aria-checked', 'true');
    await expect(args.onSelect).toHaveBeenCalledOnce();
    tile.focus();
    await userEvent.keyboard(' ');
    await expect(tile).toHaveAttribute('aria-checked', 'false');
    await expect(args.onSelect).toHaveBeenCalledTimes(2);
  },
);

export const MultiSelect = meta.story({
  args: {
    onSelect: fn(),
  },
  render: (args: StoryArgs) => <template>
    <div role="group" aria-label="selectable tiles">
      <Tile
        @selectable={{true}}
        @id="selectable-tile-1"
        @onSelect={{args.onSelect}}
      >
        <:content>Option 1</:content>
      </Tile>
      <Tile
        @selectable={{true}}
        @id="selectable-tile-2"
        @onSelect={{args.onSelect}}
      >
        <:content>Option 2</:content>
      </Tile>
      <Tile
        @selectable={{true}}
        @id="selectable-tile-3"
        @onSelect={{args.onSelect}}
      >
        <:content>Option 3</:content>
      </Tile>
    </div>
  </template>,
});

// Built with `TileGroup` and the `RadioTile` it yields: only one tile can be
// selected at a time, and `@onChange` reports the selected value.
export const Radio = meta.story({
  args: {
    onChange: fn(),
  },
  render: (args: StoryArgs) => {
    const state = trackedObject<{ selected?: Value }>({});
    const onChange = (value: Value | undefined) => {
      state.selected = value;
      args.onChange?.(value);
    };

    return <template>
      <TileGroup
        @name="radio tile group"
        @legend="Radio Tile Group"
        @defaultSelected="default-selected"
        @onChange={{onChange}}
        as |RadioTile|
      >
        <RadioTile @value="standard" style="margin-bottom: .5rem">
          Option 1
        </RadioTile>
        <RadioTile @value="default-selected" style="margin-bottom: .5rem">
          Option 2
        </RadioTile>
        <RadioTile @value="selected">Option 3</RadioTile>
      </TileGroup>
      <p>selected: {{state.selected}}</p>
    </template>;
  },
});

Radio.test(
  'selects one tile at a time',
  async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('radio', { name: 'Option 2' })).toBeChecked();
    await userEvent.click(canvas.getByText('Option 3'));
    await expect(args.onChange).toHaveBeenCalledWith('selected');
    await expect(canvas.getByRole('radio', { name: 'Option 3' })).toBeChecked();
    await expect(
      canvas.getByRole('radio', { name: 'Option 2' }),
    ).not.toBeChecked();
  },
);

export const Expandable = meta.story({
  render: () => <template>
    <div style="width: 400px">
      <Tile @expandable={{true}}>
        <:above>
          <div style="height: 200px">Above the fold content here</div>
        </:above>
        <:below>
          <div style="height: 400px">Below the fold content here</div>
        </:below>
      </Tile>
    </div>
  </template>,
});

Expandable.test(
  'expands and collapses from the chevron',
  async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', {
      name: 'Interact to expand Tile',
    });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName('Interact to collapse Tile');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  },
);

export const ExpandableWithInteractive = meta.story({
  render: () => <template>
    <div style="width: 400px">
      <Tile @expandable={{true}}>
        <:above>
          <div style="height: 200px; width: 200px">
            Above the fold content here
            <div style="padding-top: 1rem">
              <Button>Example</Button>
            </div>
          </div>
        </:above>
        <:below>
          <div style="height: 200px; width: 200px">
            Below the fold content here
            <TextInput @labelText="Text input label" />
          </div>
        </:below>
      </Tile>
    </div>
  </template>,
});

// The docs-app demo: one tile of each kind.
export const AllKinds = meta.story({
  name: 'All kinds',
  render: () => <template>
    <Tile>
      <:content>Some Content</:content>
    </Tile>
    <br />
    <Tile @expandable={{true}}>
      <:above>
        Title
        <p>Some Content</p>
      </:above>
      <:below>
        test
        <div style="height: 150px;">test height</div>
        footer
      </:below>
    </Tile>
    <br />
    <Tile @selectable={{true}}>
      <:content>Selectable content</:content>
    </Tile>
    <br />
    <Tile @clickable={{true}}>
      <:above>Title</:above>
      <:content>Some clickable Content</:content>
      <:below>footer</:below>
    </Tile>
  </template>,
});
