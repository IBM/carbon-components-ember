import type { TOC } from '@ember/component/template-only';
import { RenderStory } from 'ember-storybook';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import Search from './search.gts';

import type { Args } from './search.gts';

// Carbon React parity gaps (Components/Search):
// - `Expandable`: there is no separate ExpandableSearch; `@expandable`
//   only switches to the expandable toolbar styling, so the field doesn't
//   collapse to its icon.
// - `Skeleton`: there is no SearchSkeleton; `@isLoading` puts the field in
//   its skeleton state instead.
// - `value` seeds the field (it isn't controlled); there is no
//   `defaultValue`, `renderIcon`, `isExpanded`/`onExpand` or `onKeyDown`.

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
</template> satisfies TOC<{ Args: { args: Args; layer: string } }>;

const renderOnLayers = (args: Args) => <template>
  <div style="padding: 1rem">
    <SearchOnLayer @args={{args}} @layer="background" />
  </div>
  <Layer @withBackground={{true}} style="padding: 1rem" as |NextLayer|>
    <SearchOnLayer @args={{args}} @layer="layer 1" />
    <NextLayer @withBackground={{true}} style="padding: 1rem; margin-top: 1rem">
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
          "Search allows users to enter a term to be used to find specific content, filtering out results that don't match.\n\n`@onChange` is called with the term 200ms after the user stops typing (a pending call is cancelled by the next keystroke), and again with an empty value when the field is cleared with its close button, which also calls `@onClear`.",
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
      <div style="width: 800px; max-width: 100%">
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
    await waitFor(() =>
      expect(args.onChange).toHaveBeenLastCalledWith('carbon'),
    );
    // Debounced: one call for the whole word.
    await expect(args.onChange).toHaveBeenCalledOnce();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear search input' }),
    );
    await expect(input).toHaveValue('');
    await expect(args.onClear).toHaveBeenCalledOnce();
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

export const Skeleton = meta.story({
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
