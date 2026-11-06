import { RenderStory } from 'ember-storybook';
import { expect, fn as spy, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Pagination from './pagination.gts';

import type { PaginationSignature } from './pagination.gts';
import type { TOC } from '@ember/component/template-only';
import '#storybook/styles/pagination.css';

// Parity gaps with Carbon React's Pagination stories:
// - `WithRenderPageSelect` is hidden upstream (`!dev`, `!autodocs`) and
//   renders Carbon's `NumberInput`; the story here uses a plain button.
// - `onChange`'s `ref` (the other navigation button, to focus) isn't passed:
//   the component moves focus itself.
// - `TooltipHover` (a visual-snapshot-only story upstream) is covered by the
//   Default story's test hovering the forward button.

const meta = preview.type<{ args: PaginationSignature['Args'] }>().meta({
  title: 'Components/Pagination',
  component: Pagination,
  decorators: [
    (Story, context) => <template>
      <div class="pagination-story__container">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Pages through a list. `@totalItems`, `@page` and `@pageSize` are optional state: the component keeps the user\'s page and page size itself, follows `@page` and `@pageSize` whenever they change, and reports changes to `@onChange({ page, pageSize })`. A page size change goes back to page 1. Without `@pageSizes` there is no page size select. With `@pagesUnknown` the component shows "page N" and no totals; `@isLastPage` disables the forward button.',
      },
    },
  },
  args: {
    backwardText: 'Previous',
    backwardTextTooltipPosition: 'top',
    disabled: false,
    forwardText: 'Next',
    forwardTextTooltipPosition: 'top',
    isLastPage: false,
    itemsPerPageText: 'Items per page:',
    page: 1,
    pageInputDisabled: false,
    pageNumberText: 'Page Number',
    pageSize: 10,
    pageSizeInputDisabled: false,
    pageSizes: [10, 20, 30, 40, 50],
    pagesUnknown: false,
    size: 'md',
    totalItems: 103,
    onChange: spy(),
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

export const Default = meta.story({
  render: (args: PaginationSignature['Args']) => <template>
    <Pagination
      @backwardText={{args.backwardText}}
      @backwardTextTooltipPosition={{args.backwardTextTooltipPosition}}
      @disabled={{args.disabled}}
      @forwardText={{args.forwardText}}
      @forwardTextTooltipPosition={{args.forwardTextTooltipPosition}}
      @isLastPage={{args.isLastPage}}
      @itemsPerPageText={{args.itemsPerPageText}}
      @page={{args.page}}
      @pageInputDisabled={{args.pageInputDisabled}}
      @pageNumberText={{args.pageNumberText}}
      @pageSize={{args.pageSize}}
      @pageSizeInputDisabled={{args.pageSizeInputDisabled}}
      @pageSizes={{args.pageSizes}}
      @pagesUnknown={{args.pagesUnknown}}
      @size={{args.size}}
      @totalItems={{args.totalItems}}
      @onChange={{args.onChange}}
    />
  </template>,
});

Default.test(
  'moves to the next page',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const forward = canvas.getByRole('button', { name: 'Next' });
    await userEvent.hover(forward);
    await userEvent.click(forward);
    await waitFor(() =>
      expect(args.onChange).toHaveBeenLastCalledWith({
        page: 2,
        pageSize: 10,
      }),
    );
    await expect(
      canvasElement.querySelector('.cds--pagination__items-count'),
    ).toHaveTextContent('11–20 of 103 items');
  },
);

export const MultiplePaginationComponents = meta.story({
  name: 'Multiple Pagination components',
  render: (args: PaginationSignature['Args']) => <template>
    <div>
      <Pagination
        @page={{args.page}}
        @pageSize={{args.pageSize}}
        @pageSizes={{args.pageSizes}}
        @totalItems={{args.totalItems}}
        @onChange={{args.onChange}}
      />
      <Pagination
        @page={{args.page}}
        @pageSize={{args.pageSize}}
        @pageSizes={{args.pageSizes}}
        @totalItems={{args.totalItems}}
        @onChange={{args.onChange}}
      />
    </div>
  </template>,
});

const CUSTOM_PAGE_SIZES = [
  { text: 'Ten', value: 10 },
  { text: 'Twenty', value: 20 },
  { text: 'Thirty', value: 30 },
  { text: 'Forty', value: 40 },
  { text: 'Fifty', value: 50 },
];

export const PaginationWithCustomPageSizesLabel = meta.story({
  name: 'Pagination with custom page sizes label',
  parameters: { controls: { exclude: ['pageSizes'] } },
  render: (args: PaginationSignature['Args']) => <template>
    <Pagination
      @page={{args.page}}
      @pageSize={{args.pageSize}}
      @pageSizes={{CUSTOM_PAGE_SIZES}}
      @totalItems={{args.totalItems}}
      @onChange={{args.onChange}}
    />
  </template>,
});

export const PaginationUnknownPages = meta.story({
  name: 'Unknown pages and items',
  parameters: {
    controls: { exclude: ['pageInputDisabled', 'pagesUnknown', 'totalItems'] },
  },
  render: (args: PaginationSignature['Args']) => <template>
    <Pagination
      @page={{args.page}}
      @pageSize={{args.pageSize}}
      @pageSizes={{args.pageSizes}}
      @isLastPage={{args.isLastPage}}
      @pagesUnknown={{true}}
      @onChange={{args.onChange}}
    />
  </template>,
});

PaginationUnknownPages.test(
  'shows the page without totals',
  async ({ canvas, canvasElement, userEvent }) => {
    await expect(
      canvasElement.querySelector('.cds--pagination__items-count'),
    ).toHaveTextContent('1–10 items');
    await expect(canvas.getByText('page 1')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await waitFor(() => expect(canvas.getByText('page 2')).toBeVisible());
  },
);

const NoPageSelect: TOC<{ Args: { currentPage: number } }> = <template>

</template>;

export const WithoutPageSizes = meta.story({
  name: 'Without page sizes and render page select',
  parameters: {
    controls: {
      exclude: ['pageSizes', 'itemsPerPageText', 'pageSizeInputDisabled'],
    },
  },
  render: (args: PaginationSignature['Args']) => <template>
    <Pagination
      @pageSize={{10}}
      @totalItems={{103}}
      @renderPageSelect={{NoPageSelect}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @onChange={{args.onChange}}
    />
  </template>,
});

export const Sizes = meta.story({
  render: (args: PaginationSignature['Args']) => <template>
    <Pagination
      @size="xs"
      @pageSizes={{args.pageSizes}}
      @totalItems={{args.totalItems}}
    />
    <Pagination
      @size="sm"
      @pageSizes={{args.pageSizes}}
      @totalItems={{args.totalItems}}
    />
    <Pagination
      @size="md"
      @pageSizes={{args.pageSizes}}
      @totalItems={{args.totalItems}}
    />
    <Pagination
      @size="lg"
      @pageSizes={{args.pageSizes}}
      @totalItems={{args.totalItems}}
    />
  </template>,
});

const CustomPageSelect: TOC<{
  Args: {
    currentPage: number;
    totalPages: number;
    currentPageSize: number;
    pageSelectLabelText: string;
    onSetPage: (page: number | string) => void;
  };
}> = <template>
  <span aria-label={{@pageSelectLabelText}}>
    Page
    <button type="button" {{on "click" (fn @onSetPage 1)}}>1</button>
    of
    {{@totalPages}}
  </span>
</template>;

export const WithRenderPageSelect = meta.story({
  name: 'With custom page select (renderPageSelect)',
  parameters: {
    controls: { exclude: ['renderPageSelect'] },
    docs: {
      description: {
        story:
          'Use `@renderPageSelect` to replace the default page-select control with a custom component. It receives `@currentPage`, `@totalPages`, `@currentPageSize`, `@pageSelectLabelText` and `@onSetPage`.',
      },
    },
  },
  render: (args: PaginationSignature['Args']) => <template>
    <Pagination
      @totalItems={{350}}
      @pageSizes={{args.pageSizes}}
      @size={{args.size}}
      @renderPageSelect={{CustomPageSelect}}
      @onChange={{args.onChange}}
    />
  </template>,
});
