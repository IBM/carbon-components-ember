import type { TOC } from '@ember/component/template-only';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import Search from './search.gts';
import SearchSkeleton from './search-skeleton.gts';

import type { SearchSignature } from './search.gts';
import '#storybook/styles/search.css';

// Carbon React parity gaps (Components/Search):
// - `Expandable`: there is no separate ExpandableSearch; `@expandable`
//   only switches to the expandable toolbar styling, so the field doesn't
//   collapse to its icon.
// - There is no `renderIcon` or `isExpanded`/`onExpand`.

// Renders a search on the background and on two nested layers, like
// Carbon React's `WithLayer` story template. Each search is a `search`
// landmark, so every copy gets its own label.
const SearchOnLayer = <template>
  <Search
    @labelText="{{@args.labelText}} ({{@layer}})"
    @placeholder={{@args.placeholder}}
    @closeButtonLabelText={{@args.closeButtonLabelText}}
    @size={{@args.size}}
    @type={{@args.type}}
    @expandable={{@args.expandable}}
    @disabled={{@args.disabled}}
    @onChange={{@args.onChange}}
    @onClear={{@args.onClear}}
  />
</template> satisfies TOC<{
  Args: { args: SearchSignature['Args']; layer: string };
}>;

const renderOnLayers = (args: SearchSignature['Args']) => <template>
  <div class="search-story__padded">
    <SearchOnLayer @args={{args}} @layer="background" />
  </div>
  <Layer @withBackground={{true}} class="search-story__padded" as |NextLayer|>
    <SearchOnLayer @args={{args}} @layer="layer 1" />
    <NextLayer @withBackground={{true}} class="search-story__next-layer">
      <SearchOnLayer @args={{args}} @layer="layer 2" />
    </NextLayer>
  </Layer>
</template>;

const meta = preview.meta({
  title: 'Components/Search',
  component: Search,
  parameters: {
    docs: {
      description: {
        component:
          "Search allows users to enter a term to be used to find specific content, filtering out results that don't match.\n\n`@onChange` is called with the `input` event on every change, as in Carbon React, so the term is `event.target.value`; debounce it yourself for an expensive search. Clearing the field with its close button or Escape calls it once more with the empty value, then calls `@onClear`. Pass `@defaultValue` for an uncontrolled field, or `@value` to set it.",
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: {
    closeButtonLabelText: 'Clear search input',
    labelText: 'Site search',
    placeholder: 'Placeholder text',
    size: 'md',
    type: 'search',
    onChange: fn(),
    onClear: fn(),
  },
  decorators: [
    (Story, context) => <template>
      <div class="search-story__container">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
});

export const Default = meta.story();

Default.test(
  'reports the term and clears it',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('searchbox', { name: 'Site search' });
    await userEvent.type(input, 'carbon');
    // One call per keystroke, as in Carbon React.
    await expect(args.onChange).toHaveBeenCalledTimes(6);
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ target: input }),
    );

    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear search input' }),
    );
    await expect(input).toHaveValue('');
    await expect(args.onChange).toHaveBeenCalledTimes(7);
    await expect(args.onClear).toHaveBeenCalledOnce();
    await expect(input).toHaveFocus();
  },
);

export const Expandable = meta.story({
  args: {
    expandable: true,
  },
});

export const WithLayer = meta.story({
  render: renderOnLayers,
});

export const ExpandableWithLayer = Expandable.extend({
  render: renderOnLayers,
});

export const Loading = meta.story({
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: '`@isLoading` shows the field in its skeleton state.',
      },
    },
  },
});

export const WithValue = meta.story({
  args: {
    labelText: 'Search',
    value: 'my search',
  },
});

WithValue.test('starts with the value', async ({ canvas }) => {
  await expect(canvas.getByRole('searchbox')).toHaveValue('my search');
  await expect(
    canvas.getByRole('button', { name: 'Clear search input' }),
  ).toBeInTheDocument();
});

export const Small = meta.story({
  args: {
    labelText: 'Small search',
    size: 'sm',
  },
});

export const Disabled = meta.story({
  args: {
    labelText: 'Disabled search',
    disabled: true,
  },
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`SearchSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments. A rendered `Search` can show `@isLoading` instead (see Loading).',
      },
    },
  },
  render: () => <template><SearchSkeleton /></template>,
});
