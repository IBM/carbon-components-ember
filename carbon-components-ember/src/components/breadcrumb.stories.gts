import { expect, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Breadcrumb from './breadcrumb.gts';
import BreadcrumbItem from './breadcrumb/breadcrumb-item.gts';
import BreadcrumbSkeleton from './breadcrumb-skeleton.gts';

// Carbon React parity gaps (Components/Breadcrumb):
// - `BreadcrumbWithOverflowMenu` and its hidden size and snapshot variants:
//   an OverflowMenu in a BreadcrumbItem needs Carbon's breadcrumb menu
//   options, which wait for OverflowMenu's move to Popover.

const meta = preview.meta({
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem, BreadcrumbSkeleton },
  parameters: {
    docs: {
      description: {
        component:
          'The breadcrumb is a secondary navigation pattern that helps a user understand the hierarchy among levels and navigate back through them. Its items are the `BreadcrumbItem` it yields: one with `@href` is a link, one without is text, and `@isCurrentPage` marks the current page. To render your own link, such as a `LinkTo`, give the item block params (`<BreadcrumbItem as |item|>`): `@href` is then unused, and `item.class` and `item.ariaCurrent` go on your link. `item.ariaCurrent` comes from `@ariaCurrent` only, as in Carbon React.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: {
    noTrailingSlash: false,
    size: 'md',
  },
  render: (args) => <template>
    <Breadcrumb
      @noTrailingSlash={{args.noTrailingSlash}}
      @size={{args.size}}
      aria-label="Breadcrumb container"
      as |BreadcrumbItem|
    >
      <BreadcrumbItem as |item|>
        <a
          href="/#"
          class={{item.class}}
          aria-current={{item.ariaCurrent}}
        >Breadcrumb 1</a>
      </BreadcrumbItem>
      <BreadcrumbItem @href="#">Breadcrumb 2</BreadcrumbItem>
      <BreadcrumbItem @href="#">Breadcrumb 3</BreadcrumbItem>
      <BreadcrumbItem @href="#">Breadcrumb 4</BreadcrumbItem>
    </Breadcrumb>
  </template>,
});

export const Default = meta.story();

Default.test('lists the trail as links', async ({ canvas }) => {
  const nav = canvas.getByRole('navigation', {
    name: 'Breadcrumb container',
  });
  await expect(within(nav).getAllByRole('listitem')).toHaveLength(4);
  await expect(canvas.getByRole('link', { name: 'Breadcrumb 1' })).toHaveClass(
    'cds--link',
  );
  await expect(
    canvas.getByRole('link', { name: 'Breadcrumb 2' }),
  ).toHaveAttribute('href', '#');
});

export const CurrentPage = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'The last item is the current page: `@isCurrentPage` styles it and sets `aria-current` on it.',
      },
    },
  },
  render: (args) => <template>
    <Breadcrumb
      @noTrailingSlash={{args.noTrailingSlash}}
      @size={{args.size}}
      as |BreadcrumbItem|
    >
      <BreadcrumbItem @href="#">Breadcrumb 1</BreadcrumbItem>
      <BreadcrumbItem @href="#">Breadcrumb 2</BreadcrumbItem>
      <BreadcrumbItem @isCurrentPage={{true}}>Breadcrumb 3</BreadcrumbItem>
    </Breadcrumb>
  </template>,
});

CurrentPage.test('marks the current page', async ({ canvas }) => {
  const current = canvas.getByText('Breadcrumb 3');
  await expect(current).toHaveAttribute('aria-current', 'true');
  await expect(current.closest('li')).toHaveClass(
    'cds--breadcrumb-item--current',
  );
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`BreadcrumbSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments.',
      },
    },
  },
  render: () => <template><BreadcrumbSkeleton /></template>,
});
