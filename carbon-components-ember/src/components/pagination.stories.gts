import { fn as bind } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Pagination from './pagination.gts';

import type { PaginationSignature } from './pagination.gts';
import type { TOC } from '@ember/component/template-only';

// Parity gaps with Carbon React's Pagination stories:
// - `PaginationWithCustomPageSizesLabel`: `@itemsPerPageOptions` only takes
//   plain numbers/strings, not `{ text, value }` objects.
// - `PaginationUnknownPages`: no `pagesUnknown` arg.
// - `WithoutPageSizes`: the items-per-page select can't be hidden, and
//   `@renderPageSelect` can't hide the page select (it always renders the
//   given component).
// - No `page`/`pageSize` args (use `@state`), and no `itemsPerPageText`,
//   `pageNumberText`, `pageInputDisabled`, `pageSizeInputDisabled` or
//   `isLastPage`.
// - `TooltipHover` (a visual-snapshot-only story upstream) is covered by the
//   Default story's test hovering the forward button.

type Slice = Parameters<PaginationSignature['Args']['onPageChanged']>[0];

const meta = preview.type<{ args: PaginationSignature['Args'] }>().meta({
  title: 'Components/Pagination',
  component: Pagination,
  decorators: [
    (Story, context) => <template>
      <div style="max-width: 800px; margin-top: 15px">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  args: {
    length: 103,
    itemsPerPageOptions: [10, 20, 30, 40, 50],
    size: 'md',
    backwardText: 'Previous page',
    forwardText: 'Next page',
    backwardTextTooltipPosition: 'top',
    forwardTextTooltipPosition: 'top',
    onPageChanged: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    backwardTextTooltipPosition: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    forwardTextTooltipPosition: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
});

// `@onPageChanged` reports the current slice (page, items per page and the
// start/end indexes of the visible items), shown below the pagination.
export const Default = meta.story({
  render: (args: PaginationSignature['Args']) => {
    const state = trackedObject<{ slice?: Slice }>({});
    const onPageChanged = (slice: Slice) => {
      state.slice = slice;
      args.onPageChanged(slice);
    };

    return <template>
      <Pagination
        @length={{args.length}}
        @disabled={{args.disabled}}
        @isLoading={{args.isLoading}}
        @size={{args.size}}
        @itemsPerPageOptions={{args.itemsPerPageOptions}}
        @backwardText={{args.backwardText}}
        @forwardText={{args.forwardText}}
        @backwardTextTooltipPosition={{args.backwardTextTooltipPosition}}
        @forwardTextTooltipPosition={{args.forwardTextTooltipPosition}}
        @state={{args.state}}
        @onPageChanged={{onPageChanged}}
      />
      <p data-test-slice>
        page:
        {{state.slice.page}}, start:
        {{state.slice.start}}, end:
        {{state.slice.end}}
      </p>
    </template>;
  },
});

Default.test(
  'moves to the next page',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const forward = canvas.getByRole('button', { name: 'Next page' });
    await userEvent.hover(forward);
    await userEvent.click(forward);
    await waitFor(() =>
      expect(args.onPageChanged).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, start: 10, end: 20 }),
      ),
    );
    await expect(
      canvasElement.querySelector('[data-test-slice]'),
    ).toHaveTextContent('page: 2, start: 10, end: 20');
  },
);

export const MultiplePaginationComponents = meta.story({
  name: 'Multiple Pagination components',
  render: (args: PaginationSignature['Args']) => <template>
    <div>
      <Pagination
        @length={{args.length}}
        @itemsPerPageOptions={{args.itemsPerPageOptions}}
        @onPageChanged={{args.onPageChanged}}
      />
      <Pagination
        @length={{args.length}}
        @itemsPerPageOptions={{args.itemsPerPageOptions}}
        @onPageChanged={{args.onPageChanged}}
      />
    </div>
  </template>,
});

export const Sizes = meta.story({
  render: (args: PaginationSignature['Args']) => <template>
    <Pagination
      @size="xs"
      @length={{args.length}}
      @onPageChanged={{args.onPageChanged}}
    />
    <Pagination
      @size="sm"
      @length={{args.length}}
      @onPageChanged={{args.onPageChanged}}
    />
    <Pagination
      @size="md"
      @length={{args.length}}
      @onPageChanged={{args.onPageChanged}}
    />
    <Pagination
      @size="lg"
      @length={{args.length}}
      @onPageChanged={{args.onPageChanged}}
    />
  </template>,
});

export const CustomNavigationText = meta.story({
  name: 'Custom navigation text and tooltips',
  parameters: {
    docs: {
      description: {
        story:
          'Use `@backwardText`/`@forwardText` to customize the accessible label and tooltip content of the navigation buttons, and `@backwardTextTooltipPosition`/`@forwardTextTooltipPosition` to control where the tooltip is placed.',
      },
    },
  },
  args: {
    length: 50,
    backwardText: 'Prior page',
    forwardText: 'Later page',
    backwardTextTooltipPosition: 'bottom',
    forwardTextTooltipPosition: 'bottom',
  },
});

export const InitialState = meta.story({
  name: 'Initial page (@state)',
  args: {
    state: { page: 3, itemsPerPage: 20 },
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const Loading = meta.story({
  args: {
    isLoading: true,
  },
});

const CustomPageSelect: TOC<{
  Args: {
    currentPage: number;
    totalPages: number;
    currentPageSize: number;
    pageSelectLabelText: string;
    onSetPage: (page: number) => void;
  };
}> = <template>
  <span aria-label={{@pageSelectLabelText}}>
    Page
    <button type="button" {{on "click" (bind @onSetPage 1)}}>1</button>
    of
    {{@totalPages}}
  </span>
</template>;

export const WithRenderPageSelect = meta.story({
  name: 'With custom page select (renderPageSelect)',
  parameters: {
    docs: {
      description: {
        story:
          'Use `@renderPageSelect` to replace the default page-select control with a custom component. It receives `@currentPage`, `@totalPages`, `@currentPageSize`, `@pageSelectLabelText` and `@onSetPage`.',
      },
    },
  },
  args: {
    length: 100,
    renderPageSelect: CustomPageSelect,
  },
});
