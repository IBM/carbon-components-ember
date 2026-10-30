import preview from '#storybook/preview.ts';
import FullPageError from './full-page-error.gts';
import Link from '../link.gts';

import type { FullPageErrorSignature } from './full-page-error.gts';
import '#storybook/styles/ibm-products/full-page-error.css';

// Mirrors Carbon for IBM Products' FullPageError stories. Parity gap: they
// frame the page with a UI Shell header and breadcrumbs; these show the
// error on its own.

const meta = preview.type<{ args: FullPageErrorSignature['Args'] }>().meta({
  title: 'IBM Products/Components/FullPageError',
  component: FullPageError,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A whole page telling people the page they asked for isn\'t available, as Carbon for IBM Products\' `FullPageError`: usually a wrong URL (`@kind="404"`) or missing permissions (`@kind="403"`); `custom`, the default, fits any other error. Import it from `carbon-components-ember/ibm-products`. It takes a `@label`, `@title` and `@description`, and its block goes under them, for links back into the app.',
      },
    },
  },
  args: {
    kind: 'custom' as FullPageErrorSignature['Args']['kind'],
    title: '[Error title]',
    label: 'Error ###',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
  },
  argTypes: {
    kind: { control: 'select', options: ['403', '404', 'custom'] },
  },
  render: (args: FullPageErrorSignature['Args']) => <template>
    <div class="ibm-products-full-page-error-story__viewport">
      <FullPageError
        @kind={{args.kind}}
        @label={{args.label}}
        @title={{args.title}}
        @description={{args.description}}
      >
        <Link @size="lg" @href="/">– Forwarding Link 1</Link>
        <br />
        <Link @size="lg" @href="/">– Forwarding Link 1</Link>
      </FullPageError>
    </div>
  </template>,
});

export const Default = meta.story({});

export const _403 = meta.story({
  name: '403',
  args: {
    kind: '403',
    title: 'Access denied',
    label: 'Error 403',
    description:
      'You are not authorized to access the requested page. Please verify that you are logged in to the hosting environment and your access permissions are correct.',
  },
});

export const _404 = meta.story({
  name: '404',
  args: {
    kind: '404',
    title: 'Page not found',
    label: 'Error 404',
    description:
      'The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content.',
  },
});
