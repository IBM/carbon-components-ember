import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import Button from 'carbon-components-ember/components/button';
import Tag from 'carbon-components-ember/components/tag';
import Loading from 'carbon-components-ember/components/loading';
import Link from 'carbon-components-ember/components/link';
import UnorderedList from 'carbon-components-ember/components/unordered-list';
import OrderedList from 'carbon-components-ember/components/ordered-list';
import ListItem from 'carbon-components-ember/components/list-item';
import Grid from 'carbon-components-ember/components/grid';
import GridRow from 'carbon-components-ember/components/grid/row';
import GridColumn from 'carbon-components-ember/components/grid/column';
import GridColumnHang from 'carbon-components-ember/components/grid/column-hang';
import Notification from 'carbon-components-ember/components/notification';
import { normalizeElement } from '../../../dom-parity/lib/normalize-dom.mjs';
import {
  diffNormalized,
  applyKnownDifferences,
} from '../../../dom-parity/lib/diff-normalized.mjs';
import knownDifferences from '../../../dom-parity/known-differences.json';
import buttonFixture from '../../../dom-parity/fixtures/Button.json';
import tagFixture from '../../../dom-parity/fixtures/Tag.json';
import loadingFixture from '../../../dom-parity/fixtures/Loading.json';
import linkFixture from '../../../dom-parity/fixtures/Link.json';
import unorderedListFixture from '../../../dom-parity/fixtures/UnorderedList.json';
import orderedListFixture from '../../../dom-parity/fixtures/OrderedList.json';
import listItemFixture from '../../../dom-parity/fixtures/ListItem.json';
import gridFixture from '../../../dom-parity/fixtures/Grid.json';
import gridRowFixture from '../../../dom-parity/fixtures/GridRow.json';
import gridColumnFixture from '../../../dom-parity/fixtures/GridColumn.json';
import gridColumnHangFixture from '../../../dom-parity/fixtures/GridColumnHang.json';
import notificationFixture from '../../../dom-parity/fixtures/Notification.json';

type VariantFixture = { props: object; dom: object };
type ComponentFixture = {
  component: string;
  carbonReactVersion: string;
  variants: Record<string, VariantFixture>;
};

/**
 * Compares an Ember-rendered root element against one variant's fixture,
 * captured from a pinned @carbon/react release (see dom-parity/generate.mjs).
 * Differences pre-approved in dom-parity/known-differences.json (real,
 * tracked gaps, optionally scoped to this exact `variant`) are filtered out
 * before asserting - a change here should either fix the component or add a
 * new, reasoned entry to that file, not both.
 */
function assertDomParity(
  assert: Assert,
  fixture: ComponentFixture,
  variant: string,
  rootElement: Element | null,
) {
  const variantFixture = fixture.variants[variant];
  if (!variantFixture) {
    assert.ok(false, `${fixture.component}: no fixture recorded for variant "${variant}"`);
    return;
  }

  if (!rootElement) {
    assert.ok(false, `${fixture.component}/${variant}: nothing rendered`);
    return;
  }

  const emberTree = normalizeElement(rootElement);
  const differences = diffNormalized(variantFixture.dom, emberTree);
  const known =
    (knownDifferences as Record<string, Array<{ path: string; reason: string; variant?: string }>>)[
      fixture.component
    ] ?? [];
  const unexpected = applyKnownDifferences(differences, known, variant);

  assert.deepEqual(
    unexpected,
    [],
    `${fixture.component}/${variant} should render the same tag/classes/attributes/style as ` +
      `@carbon/react@${fixture.carbonReactVersion}, modulo the documented gaps in ` +
      `dom-parity/known-differences.json`,
  );
}

/**
 * A variant added to dom-parity/lib/components.mjs (and regenerated into a
 * fixture) with no matching entry here would otherwise go silently
 * untested - this is a static list, not populated at test-run time, so it
 * stays correct even when the suite is filtered down to a single test.
 */
function assertFullCoverage(assert: Assert, fixture: ComponentFixture, coveredVariants: string[]) {
  assert.deepEqual(
    Object.keys(fixture.variants).sort(),
    [...coveredVariants].sort(),
    `every variant in dom-parity/fixtures/${fixture.component}.json should have a matching render case in this file`,
  );
}

module('DOM parity | Carbon React', function (hooks) {
  setupRenderingTest(hooks);

  module('Button', function () {
    test('primary-lg', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @type='primary' @size='lg'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'primary-lg', this.element.firstElementChild);
    });

    test('secondary', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @type='secondary' @size='md'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'secondary', this.element.firstElementChild);
    });

    test('danger', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @type='danger' @size='md'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'danger', this.element.firstElementChild);
    });

    test('tertiary', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @tertiary={{true}} @size='md'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'tertiary', this.element.firstElementChild);
    });

    test('ghost', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @ghost={{true}} @size='md'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'ghost', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @type='primary' @size='sm'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'size-sm', this.element.firstElementChild);
    });

    test('size-md', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @type='primary' @size='md'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'size-md', this.element.firstElementChild);
    });

    test('size-xl', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @type='primary' @size='xl'>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'size-xl', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Button @type='primary' @size='md' @disabled={{true}}>Button</Button>
        </template>,
      );
      assertDomParity(assert, buttonFixture, 'disabled', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, buttonFixture, [
        'primary-lg',
        'secondary',
        'danger',
        'tertiary',
        'ghost',
        'size-sm',
        'size-md',
        'size-xl',
        'disabled',
      ]);
    });
  });

  module('Tag', function () {
    const types = [
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
    ] as const;

    for (const type of types) {
      test(type, async function (this: RenderingTestContext, assert) {
        await render(<template><Tag @type={{type}}>Tag content</Tag></template>);
        assertDomParity(assert, tagFixture, type, this.element.firstElementChild);
      });
    }

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tag @type='gray' @disabled={{true}}>Tag content</Tag>
        </template>,
      );
      assertDomParity(assert, tagFixture, 'disabled', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tag @type='gray' @size='sm'>Tag content</Tag>
        </template>,
      );
      assertDomParity(assert, tagFixture, 'size-sm', this.element.firstElementChild);
    });

    test('size-lg', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tag @type='gray' @size='lg'>Tag content</Tag>
        </template>,
      );
      assertDomParity(assert, tagFixture, 'size-lg', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, tagFixture, [...types, 'disabled', 'size-sm', 'size-lg']);
    });
  });

  module('Loading', function () {
    test('overlay-active', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Active loading indicator'
            @withOverlay={{true}}
            @active={{true}}
          />
        </template>,
      );
      assertDomParity(assert, loadingFixture, 'overlay-active', this.element.firstElementChild);
    });

    test('overlay-active-small', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Active loading indicator'
            @withOverlay={{true}}
            @active={{true}}
            @small={{true}}
          />
        </template>,
      );
      assertDomParity(
        assert,
        loadingFixture,
        'overlay-active-small',
        this.element.firstElementChild,
      );
    });

    test('overlay-inactive', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Stopped loading indicator'
            @withOverlay={{true}}
            @active={{false}}
          />
        </template>,
      );
      assertDomParity(assert, loadingFixture, 'overlay-inactive', this.element.firstElementChild);
    });

    test('overlay-inactive-small', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Stopped loading indicator'
            @withOverlay={{true}}
            @active={{false}}
            @small={{true}}
          />
        </template>,
      );
      assertDomParity(
        assert,
        loadingFixture,
        'overlay-inactive-small',
        this.element.firstElementChild,
      );
    });

    test('plain-active', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Active loading indicator'
            @withOverlay={{false}}
            @active={{true}}
          />
        </template>,
      );
      assertDomParity(assert, loadingFixture, 'plain-active', this.element.firstElementChild);
    });

    test('plain-active-small', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Active loading indicator'
            @withOverlay={{false}}
            @active={{true}}
            @small={{true}}
          />
        </template>,
      );
      assertDomParity(
        assert,
        loadingFixture,
        'plain-active-small',
        this.element.firstElementChild,
      );
    });

    test('plain-inactive', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Stopped loading indicator'
            @withOverlay={{false}}
            @active={{false}}
          />
        </template>,
      );
      assertDomParity(assert, loadingFixture, 'plain-inactive', this.element.firstElementChild);
    });

    test('plain-inactive-small', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading
            @description='Stopped loading indicator'
            @withOverlay={{false}}
            @active={{false}}
            @small={{true}}
          />
        </template>,
      );
      assertDomParity(
        assert,
        loadingFixture,
        'plain-inactive-small',
        this.element.firstElementChild,
      );
    });

    test('inline', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Loading @description='Active loading indicator' @inline={{true}} @active={{true}} />
        </template>,
      );
      assertDomParity(assert, loadingFixture, 'inline', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, loadingFixture, [
        'overlay-active',
        'overlay-active-small',
        'overlay-inactive',
        'overlay-inactive-small',
        'plain-active',
        'plain-active-small',
        'plain-inactive',
        'plain-inactive-small',
        'inline',
      ]);
    });
  });

  module('Link', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><Link @href='/about'>Link text</Link></template>);
      assertDomParity(assert, linkFixture, 'default', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Link @href='/about' @disabled={{true}}>Link text</Link>
        </template>,
      );
      assertDomParity(assert, linkFixture, 'disabled', this.element.firstElementChild);
    });

    test('inline', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Link @href='/about' @inline={{true}}>Link text</Link>
        </template>,
      );
      assertDomParity(assert, linkFixture, 'inline', this.element.firstElementChild);
    });

    test('visited', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Link @href='/about' @visited={{true}}>Link text</Link>
        </template>,
      );
      assertDomParity(assert, linkFixture, 'visited', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Link @href='/about' @size='sm'>Link text</Link>
        </template>,
      );
      assertDomParity(assert, linkFixture, 'size-sm', this.element.firstElementChild);
    });

    test('size-lg', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Link @href='/about' @size='lg'>Link text</Link>
        </template>,
      );
      assertDomParity(assert, linkFixture, 'size-lg', this.element.firstElementChild);
    });

    test('target-blank', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Link @href='/about' @target='_blank'>Link text</Link>
        </template>,
      );
      assertDomParity(assert, linkFixture, 'target-blank', this.element.firstElementChild);
    });

    test('as-button', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Link @as='button' @href='/about'>Link text</Link>
        </template>,
      );
      assertDomParity(assert, linkFixture, 'as-button', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, linkFixture, [
        'default',
        'disabled',
        'inline',
        'visited',
        'size-sm',
        'size-lg',
        'target-blank',
        'as-button',
      ]);
    });
  });

  module('UnorderedList', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <UnorderedList>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </UnorderedList>
        </template>,
      );
      assertDomParity(assert, unorderedListFixture, 'default', this.element.firstElementChild);
    });

    test('nested', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <UnorderedList @nested={{true}}>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </UnorderedList>
        </template>,
      );
      assertDomParity(assert, unorderedListFixture, 'nested', this.element.firstElementChild);
    });

    test('expressive', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <UnorderedList @isExpressive={{true}}>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </UnorderedList>
        </template>,
      );
      assertDomParity(assert, unorderedListFixture, 'expressive', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, unorderedListFixture, ['default', 'nested', 'expressive']);
    });
  });

  module('OrderedList', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <OrderedList>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </OrderedList>
        </template>,
      );
      assertDomParity(assert, orderedListFixture, 'default', this.element.firstElementChild);
    });

    test('nested', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <OrderedList @nested={{true}}>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </OrderedList>
        </template>,
      );
      assertDomParity(assert, orderedListFixture, 'nested', this.element.firstElementChild);
    });

    test('expressive', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <OrderedList @isExpressive={{true}}>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </OrderedList>
        </template>,
      );
      assertDomParity(assert, orderedListFixture, 'expressive', this.element.firstElementChild);
    });

    test('native', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <OrderedList @native={{true}}>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </OrderedList>
        </template>,
      );
      assertDomParity(assert, orderedListFixture, 'native', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, orderedListFixture, [
        'default',
        'nested',
        'expressive',
        'native',
      ]);
    });
  });

  module('ListItem', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><ListItem>Item content</ListItem></template>);
      assertDomParity(assert, listItemFixture, 'default', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, listItemFixture, ['default']);
    });
  });

  // See dom-parity/lib/components.mjs's top-of-file comment for why these
  // compare against `Carbon.FlexGrid`/`Row`/`Column`/`ColumnHang` rather
  // than `Carbon.Grid` (feature-flag dependent) and use plain-text
  // children instead of nesting Grid components inside each other.
  module('Grid', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><Grid>Grid content</Grid></template>);
      assertDomParity(assert, gridFixture, 'default', this.element.firstElementChild);
    });

    test('condensed', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Grid @condensed={{true}}>Grid content</Grid>
        </template>,
      );
      assertDomParity(assert, gridFixture, 'condensed', this.element.firstElementChild);
    });

    test('narrow', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Grid @narrow={{true}}>Grid content</Grid>
        </template>,
      );
      assertDomParity(assert, gridFixture, 'narrow', this.element.firstElementChild);
    });

    test('full-width', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Grid @fullWidth={{true}}>Grid content</Grid>
        </template>,
      );
      assertDomParity(assert, gridFixture, 'full-width', this.element.firstElementChild);
    });

    test('with-row-gap', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Grid @withRowGap={{true}}>Grid content</Grid>
        </template>,
      );
      assertDomParity(assert, gridFixture, 'with-row-gap', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, gridFixture, [
        'default',
        'condensed',
        'narrow',
        'full-width',
        'with-row-gap',
      ]);
    });
  });

  module('GridRow', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><GridRow>Row content</GridRow></template>);
      assertDomParity(assert, gridRowFixture, 'default', this.element.firstElementChild);
    });

    test('condensed', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <GridRow @condensed={{true}}>Row content</GridRow>
        </template>,
      );
      assertDomParity(assert, gridRowFixture, 'condensed', this.element.firstElementChild);
    });

    test('narrow', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <GridRow @narrow={{true}}>Row content</GridRow>
        </template>,
      );
      assertDomParity(assert, gridRowFixture, 'narrow', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, gridRowFixture, ['default', 'condensed', 'narrow']);
    });
  });

  module('GridColumn', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><GridColumn>Column content</GridColumn></template>);
      assertDomParity(assert, gridColumnFixture, 'default', this.element.firstElementChild);
    });

    test('sm', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <GridColumn @sm={{2}}>Column content</GridColumn>
        </template>,
      );
      assertDomParity(assert, gridColumnFixture, 'sm', this.element.firstElementChild);
    });

    test('multi-breakpoint', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <GridColumn @sm={{4}} @md={{4}} @lg={{8}}>Column content</GridColumn>
        </template>,
      );
      assertDomParity(
        assert,
        gridColumnFixture,
        'multi-breakpoint',
        this.element.firstElementChild,
      );
    });

    test('auto', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <GridColumn @lg={{true}}>Column content</GridColumn>
        </template>,
      );
      assertDomParity(assert, gridColumnFixture, 'auto', this.element.firstElementChild);
    });

    test('offset', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <GridColumn @lg={{hash span=4 offset=2}}>Column content</GridColumn>
        </template>,
      );
      assertDomParity(assert, gridColumnFixture, 'offset', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, gridColumnFixture, [
        'default',
        'sm',
        'multi-breakpoint',
        'auto',
        'offset',
      ]);
    });
  });

  module('GridColumnHang', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><GridColumnHang>Hang content</GridColumnHang></template>);
      assertDomParity(assert, gridColumnHangFixture, 'default', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, gridColumnHangFixture, ['default']);
    });
  });

  // See dom-parity/lib/components.mjs's top-of-file comment for why only
  // the `toast` and `inline` displays are covered (not `actionable`) and
  // why `title`/`text`/`caption` are always given non-empty values.
  module('Notification', function () {
    const kinds = ['error', 'info', 'info-square', 'success', 'warning', 'warning-alt'] as const;

    for (const kind of kinds) {
      test(`toast-${kind}`, async function (this: RenderingTestContext, assert) {
        await render(
          <template>
            <Notification
              @kind={{kind}}
              @title='Notification title'
              @text='Notification subtitle'
              @caption='Notification caption'
            />
          </template>,
        );
        // Notification renders two icons (the kind icon and the close
        // icon) and, like every icon in this addon, each loads its SVG
        // asynchronously via a TrackedPromise - settled() alone doesn't
        // wait for it, so wait for both real <svg>s to land before diffing.
        await waitUntil(() => this.element.querySelectorAll('svg').length === 2);
        assertDomParity(
          assert,
          notificationFixture,
          `toast-${kind}`,
          this.element.firstElementChild,
        );
      });

      test(`inline-${kind}`, async function (this: RenderingTestContext, assert) {
        await render(
          <template>
            <Notification
              @display='inline'
              @kind={{kind}}
              @title='Notification title'
              @text='Notification subtitle'
            />
          </template>,
        );
        await waitUntil(() => this.element.querySelectorAll('svg').length === 2);
        assertDomParity(
          assert,
          notificationFixture,
          `inline-${kind}`,
          this.element.firstElementChild,
        );
      });
    }

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, notificationFixture, [
        ...kinds.map((kind) => `toast-${kind}`),
        ...kinds.map((kind) => `inline-${kind}`),
      ]);
    });
  });
});
