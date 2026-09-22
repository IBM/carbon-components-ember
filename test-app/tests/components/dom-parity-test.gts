import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil, click } from '@ember/test-helpers';
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
import Tile from 'carbon-components-ember/components/tile';
import RadioTile from 'carbon-components-ember/components/radio-tile';
import TileGroup from 'carbon-components-ember/components/tile/tile-group';
import SkeletonIcon from 'carbon-components-ember/components/skeleton-icon';
import SkeletonPlaceholder from 'carbon-components-ember/components/skeleton-placeholder';
import SkeletonText from 'carbon-components-ember/components/skeleton-text';
import TextAreaSkeleton from 'carbon-components-ember/components/text-area-skeleton';
import SliderSkeleton from 'carbon-components-ember/components/slider-skeleton';
import FileUploaderSkeleton from 'carbon-components-ember/components/file-uploader/file-uploader-skeleton';
import Checkbox from 'carbon-components-ember/components/checkbox';
import RadioButton from 'carbon-components-ember/components/radio-button';
import RadioButtonGroup from 'carbon-components-ember/components/radio-button/group';
import Toggle from 'carbon-components-ember/components/toggle';
import TextInput from 'carbon-components-ember/components/text-input';
import TextArea from 'carbon-components-ember/components/text-area';
import PasswordInput from 'carbon-components-ember/components/password-input';
import NumberInput from 'carbon-components-ember/components/number-input';
import FluidTextInput from 'carbon-components-ember/components/fluid-text-input';
import Search from 'carbon-components-ember/components/search';
import FileUploaderButton from 'carbon-components-ember/components/file-uploader/file-uploader-button';
import FileUploaderDropContainer from 'carbon-components-ember/components/file-uploader/file-uploader-drop-container';
import FileUploader from 'carbon-components-ember/components/file-uploader';
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
import tileFixture from '../../../dom-parity/fixtures/Tile.json';
import clickableTileFixture from '../../../dom-parity/fixtures/ClickableTile.json';
import radioTileFixture from '../../../dom-parity/fixtures/RadioTile.json';
import tileGroupFixture from '../../../dom-parity/fixtures/TileGroup.json';
import selectableTileFixture from '../../../dom-parity/fixtures/SelectableTile.json';
import expandableTileFixture from '../../../dom-parity/fixtures/ExpandableTile.json';
import skeletonIconFixture from '../../../dom-parity/fixtures/SkeletonIcon.json';
import skeletonPlaceholderFixture from '../../../dom-parity/fixtures/SkeletonPlaceholder.json';
import skeletonTextFixture from '../../../dom-parity/fixtures/SkeletonText.json';
import textAreaSkeletonFixture from '../../../dom-parity/fixtures/TextAreaSkeleton.json';
import sliderSkeletonFixture from '../../../dom-parity/fixtures/SliderSkeleton.json';
import fileUploaderSkeletonFixture from '../../../dom-parity/fixtures/FileUploaderSkeleton.json';
import checkboxFixture from '../../../dom-parity/fixtures/Checkbox.json';
import radioButtonFixture from '../../../dom-parity/fixtures/RadioButton.json';
import radioButtonGroupFixture from '../../../dom-parity/fixtures/RadioButtonGroup.json';
import toggleFixture from '../../../dom-parity/fixtures/Toggle.json';
import textInputFixture from '../../../dom-parity/fixtures/TextInput.json';
import textAreaFixture from '../../../dom-parity/fixtures/TextArea.json';
import passwordInputFixture from '../../../dom-parity/fixtures/PasswordInput.json';
import numberInputFixture from '../../../dom-parity/fixtures/NumberInput.json';
import fluidTextInputFixture from '../../../dom-parity/fixtures/FluidTextInput.json';
import searchFixture from '../../../dom-parity/fixtures/Search.json';
import fileUploaderButtonFixture from '../../../dom-parity/fixtures/FileUploaderButton.json';
import fileUploaderDropContainerFixture from '../../../dom-parity/fixtures/FileUploaderDropContainer.json';
import fileUploaderFixture from '../../../dom-parity/fixtures/FileUploader.json';

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

  // See dom-parity/lib/components.mjs's top-of-file comment for how
  // `@selectable`/`@expandable` (covered further below, as `SelectableTile`/
  // `ExpandableTile`) map to their own separate upstream components.
  module('Tile', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tile><:content>Tile content</:content></Tile>
        </template>,
      );
      assertDomParity(assert, tileFixture, 'default', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, tileFixture, ['default']);
    });
  });

  module('ClickableTile', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tile @clickable={{true}}><:content>Clickable tile content</:content></Tile>
        </template>,
      );
      assertDomParity(assert, clickableTileFixture, 'default', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, clickableTileFixture, ['default']);
    });
  });

  module('RadioTile', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><RadioTile @value='a'>Radio tile content</RadioTile></template>);
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);
      assertDomParity(assert, radioTileFixture, 'default', this.element.firstElementChild);
    });

    test('checked', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioTile @value='a' @checked={{true}}>Radio tile content</RadioTile>
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);
      assertDomParity(assert, radioTileFixture, 'checked', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioTile @value='a' @disabled={{true}}>Radio tile content</RadioTile>
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);
      assertDomParity(assert, radioTileFixture, 'disabled', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, radioTileFixture, ['default', 'checked', 'disabled']);
    });
  });

  module('TileGroup', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <TileGroup @name='tiles' @legend='Choose one' @defaultSelected='a' as |RadioTileItem|>
            <RadioTileItem @value='a'>Option A</RadioTileItem>
            <RadioTileItem @value='b'>Option B</RadioTileItem>
          </TileGroup>
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length === 2);
      assertDomParity(assert, tileGroupFixture, 'default', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, tileGroupFixture, ['default']);
    });
  });

  module('SelectableTile', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tile @selectable={{true}}><:content>Selectable tile content</:content></Tile>
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);
      assertDomParity(assert, selectableTileFixture, 'default', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, selectableTileFixture, ['default']);
    });
  });

  module('ExpandableTile', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tile @expandable={{true}}>
            <:above><button type='button'>Above content</button></:above>
            <:below>Below content</:below>
          </Tile>
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);
      assertDomParity(assert, expandableTileFixture, 'default', this.element.firstElementChild);
    });

    test('expanded', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <Tile @expandable={{true}}>
            <:above><button type='button'>Above content</button></:above>
            <:below>Below content</:below>
          </Tile>
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);
      await click('.cds--tile__chevron');
      assertDomParity(assert, expandableTileFixture, 'expanded', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, expandableTileFixture, ['default', 'expanded']);
    });
  });

  module('SkeletonIcon', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><SkeletonIcon /></template>);
      assertDomParity(assert, skeletonIconFixture, 'default', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, skeletonIconFixture, ['default']);
    });
  });

  module('SkeletonPlaceholder', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><SkeletonPlaceholder /></template>);
      assertDomParity(
        assert,
        skeletonPlaceholderFixture,
        'default',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, skeletonPlaceholderFixture, ['default']);
    });
  });

  module('SkeletonText', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><SkeletonText /></template>);
      assertDomParity(assert, skeletonTextFixture, 'default', this.element.firstElementChild);
    });

    test('heading', async function (this: RenderingTestContext, assert) {
      await render(<template><SkeletonText @heading={{true}} /></template>);
      assertDomParity(assert, skeletonTextFixture, 'heading', this.element.firstElementChild);
    });

    test('paragraph', async function (this: RenderingTestContext, assert) {
      await render(<template><SkeletonText @paragraph={{true}} /></template>);
      assertDomParity(assert, skeletonTextFixture, 'paragraph', this.element.firstElementChild);
    });

    test('paragraph-line-count', async function (this: RenderingTestContext, assert) {
      await render(
        <template><SkeletonText @paragraph={{true}} @lineCount={{5}} /></template>,
      );
      assertDomParity(
        assert,
        skeletonTextFixture,
        'paragraph-line-count',
        this.element.firstElementChild,
      );
    });

    test('paragraph-width-px', async function (this: RenderingTestContext, assert) {
      await render(
        <template><SkeletonText @paragraph={{true}} @width='300px' /></template>,
      );
      assertDomParity(
        assert,
        skeletonTextFixture,
        'paragraph-width-px',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, skeletonTextFixture, [
        'default',
        'heading',
        'paragraph',
        'paragraph-line-count',
        'paragraph-width-px',
      ]);
    });
  });

  module('TextAreaSkeleton', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><TextAreaSkeleton /></template>);
      assertDomParity(assert, textAreaSkeletonFixture, 'default', this.element.firstElementChild);
    });

    test('hide-label', async function (this: RenderingTestContext, assert) {
      await render(<template><TextAreaSkeleton @hideLabel={{true}} /></template>);
      assertDomParity(
        assert,
        textAreaSkeletonFixture,
        'hide-label',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, textAreaSkeletonFixture, ['default', 'hide-label']);
    });
  });

  module('SliderSkeleton', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><SliderSkeleton /></template>);
      assertDomParity(assert, sliderSkeletonFixture, 'default', this.element.firstElementChild);
    });

    test('hide-label', async function (this: RenderingTestContext, assert) {
      await render(<template><SliderSkeleton @hideLabel={{true}} /></template>);
      assertDomParity(assert, sliderSkeletonFixture, 'hide-label', this.element.firstElementChild);
    });

    test('two-handles', async function (this: RenderingTestContext, assert) {
      await render(<template><SliderSkeleton @twoHandles={{true}} /></template>);
      assertDomParity(
        assert,
        sliderSkeletonFixture,
        'two-handles',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, sliderSkeletonFixture, ['default', 'hide-label', 'two-handles']);
    });
  });

  module('FileUploaderSkeleton', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderSkeleton /></template>);
      assertDomParity(
        assert,
        fileUploaderSkeletonFixture,
        'default',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, fileUploaderSkeletonFixture, ['default']);
    });
  });

  module('Checkbox', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><Checkbox @label='Checkbox label' /></template>);
      assertDomParity(assert, checkboxFixture, 'default', this.element.firstElementChild);
    });

    test('checked', async function (this: RenderingTestContext, assert) {
      await render(<template><Checkbox @label='Checkbox label' @checked={{true}} /></template>);
      assertDomParity(assert, checkboxFixture, 'checked', this.element.firstElementChild);
    });

    test('indeterminate', async function (this: RenderingTestContext, assert) {
      await render(
        <template><Checkbox @label='Checkbox label' @indeterminate={{true}} /></template>,
      );
      assertDomParity(assert, checkboxFixture, 'indeterminate', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(<template><Checkbox @label='Checkbox label' @disabled={{true}} /></template>);
      assertDomParity(assert, checkboxFixture, 'disabled', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, checkboxFixture, ['default', 'checked', 'indeterminate', 'disabled']);
    });
  });

  module('RadioButton', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButton @name='radio-group' @value='a' @labelText='Radio label' />
        </template>,
      );
      assertDomParity(assert, radioButtonFixture, 'default', this.element.firstElementChild);
    });

    test('checked', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButton
            @name='radio-group'
            @value='a'
            @labelText='Radio label'
            @checked={{true}}
          />
        </template>,
      );
      assertDomParity(assert, radioButtonFixture, 'checked', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButton
            @name='radio-group'
            @value='a'
            @labelText='Radio label'
            @disabled={{true}}
          />
        </template>,
      );
      assertDomParity(assert, radioButtonFixture, 'disabled', this.element.firstElementChild);
    });

    test('label-position-left', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButton
            @name='radio-group'
            @value='a'
            @labelText='Radio label'
            @labelPosition='left'
          />
        </template>,
      );
      assertDomParity(
        assert,
        radioButtonFixture,
        'label-position-left',
        this.element.firstElementChild,
      );
    });

    test('hide-label', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButton
            @name='radio-group'
            @value='a'
            @labelText='Radio label'
            @hideLabel={{true}}
          />
        </template>,
      );
      assertDomParity(assert, radioButtonFixture, 'hide-label', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, radioButtonFixture, [
        'default',
        'checked',
        'disabled',
        'label-position-left',
        'hide-label',
      ]);
    });
  });

  module('RadioButtonGroup', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButtonGroup @name='radio-group' @legendText='Choose one' as |Radio|>
            <Radio @value='a' @labelText='Option A' />
            <Radio @value='b' @labelText='Option B' />
          </RadioButtonGroup>
        </template>,
      );
      assertDomParity(assert, radioButtonGroupFixture, 'default', this.element.firstElementChild);
    });

    test('vertical', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButtonGroup
            @name='radio-group'
            @legendText='Choose one'
            @orientation='vertical'
            as |Radio|
          >
            <Radio @value='a' @labelText='Option A' />
            <Radio @value='b' @labelText='Option B' />
          </RadioButtonGroup>
        </template>,
      );
      assertDomParity(assert, radioButtonGroupFixture, 'vertical', this.element.firstElementChild);
    });

    test('label-position-left', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButtonGroup
            @name='radio-group'
            @legendText='Choose one'
            @labelPosition='left'
            as |Radio|
          >
            <Radio @value='a' @labelText='Option A' />
            <Radio @value='b' @labelText='Option B' />
          </RadioButtonGroup>
        </template>,
      );
      assertDomParity(
        assert,
        radioButtonGroupFixture,
        'label-position-left',
        this.element.firstElementChild,
      );
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButtonGroup
            @name='radio-group'
            @legendText='Choose one'
            @disabled={{true}}
            as |Radio|
          >
            <Radio @value='a' @labelText='Option A' />
            <Radio @value='b' @labelText='Option B' />
          </RadioButtonGroup>
        </template>,
      );
      assertDomParity(assert, radioButtonGroupFixture, 'disabled', this.element.firstElementChild);
    });

    test('default-selected', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <RadioButtonGroup
            @name='radio-group'
            @legendText='Choose one'
            @defaultSelected='a'
            as |Radio|
          >
            <Radio @value='a' @labelText='Option A' />
            <Radio @value='b' @labelText='Option B' />
          </RadioButtonGroup>
        </template>,
      );
      assertDomParity(
        assert,
        radioButtonGroupFixture,
        'default-selected',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, radioButtonGroupFixture, [
        'default',
        'vertical',
        'label-position-left',
        'disabled',
        'default-selected',
      ]);
    });
  });

  module('Toggle', function () {
    // @value={{false}} is passed explicitly (rather than left absent) on the
    // non-toggled variants below because Glimmer's `aria-checked='{{@value}}'`
    // binding omits the attribute entirely when the interpolated value is
    // undefined - matching upstream's own `aria-checked` (which always
    // reflects `checked`, defaulting to false) needs a real `false`, not an
    // absent arg.
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><Toggle @name='Toggle label' @value={{false}} /></template>);
      assertDomParity(assert, toggleFixture, 'default', this.element.firstElementChild);
    });

    test('toggled', async function (this: RenderingTestContext, assert) {
      await render(<template><Toggle @name='Toggle label' @value={{true}} /></template>);
      assertDomParity(assert, toggleFixture, 'toggled', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template><Toggle @name='Toggle label' @value={{false}} @disabled={{true}} /></template>,
      );
      assertDomParity(assert, toggleFixture, 'disabled', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(
        <template><Toggle @name='Toggle label' @value={{false}} @size='sm' /></template>,
      );
      assertDomParity(assert, toggleFixture, 'size-sm', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, toggleFixture, ['default', 'toggled', 'disabled', 'size-sm']);
    });
  });

  module('TextInput', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><TextInput @labelText='Text input label' /></template>);
      assertDomParity(assert, textInputFixture, 'default', this.element.firstElementChild);
    });

    test('with-value', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextInput @labelText='Text input label' @value='Hello' /></template>,
      );
      assertDomParity(assert, textInputFixture, 'with-value', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextInput @labelText='Text input label' @disabled={{true}} /></template>,
      );
      assertDomParity(assert, textInputFixture, 'disabled', this.element.firstElementChild);
    });

    test('invalid', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <TextInput
            @labelText='Text input label'
            @invalid={{true}}
            @invalidText='Invalid value'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, textInputFixture, 'invalid', this.element.firstElementChild);
    });

    test('warn', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <TextInput @labelText='Text input label' @warn={{true}} @warnText='Warning message' />
        </template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, textInputFixture, 'warn', this.element.firstElementChild);
    });

    test('read-only', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextInput @labelText='Text input label' @readOnly={{true}} /></template>,
      );
      assertDomParity(assert, textInputFixture, 'read-only', this.element.firstElementChild);
    });

    test('light', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextInput @labelText='Text input label' @light={{true}} /></template>,
      );
      assertDomParity(assert, textInputFixture, 'light', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextInput @labelText='Text input label' @size='sm' /></template>,
      );
      assertDomParity(assert, textInputFixture, 'size-sm', this.element.firstElementChild);
    });

    test('size-lg', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextInput @labelText='Text input label' @size='lg' /></template>,
      );
      assertDomParity(assert, textInputFixture, 'size-lg', this.element.firstElementChild);
    });

    test('helper-text', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <TextInput @labelText='Text input label' @helperText='Helper text' />
        </template>,
      );
      assertDomParity(assert, textInputFixture, 'helper-text', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, textInputFixture, [
        'default',
        'with-value',
        'disabled',
        'invalid',
        'warn',
        'read-only',
        'light',
        'size-sm',
        'size-lg',
        'helper-text',
      ]);
    });
  });

  module('TextArea', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><TextArea @labelText='Text area label' /></template>);
      assertDomParity(assert, textAreaFixture, 'default', this.element.firstElementChild);
    });

    test('with-value', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextArea @labelText='Text area label' @value='Hello' /></template>,
      );
      assertDomParity(assert, textAreaFixture, 'with-value', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextArea @labelText='Text area label' @disabled={{true}} /></template>,
      );
      assertDomParity(assert, textAreaFixture, 'disabled', this.element.firstElementChild);
    });

    test('invalid', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <TextArea
            @labelText='Text area label'
            @invalid={{true}}
            @invalidText='Invalid value'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, textAreaFixture, 'invalid', this.element.firstElementChild);
    });

    test('warn', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <TextArea @labelText='Text area label' @warn={{true}} @warnText='Warning message' />
        </template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, textAreaFixture, 'warn', this.element.firstElementChild);
    });

    test('read-only', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextArea @labelText='Text area label' @readOnly={{true}} /></template>,
      );
      assertDomParity(assert, textAreaFixture, 'read-only', this.element.firstElementChild);
    });

    test('light', async function (this: RenderingTestContext, assert) {
      await render(
        <template><TextArea @labelText='Text area label' @light={{true}} /></template>,
      );
      assertDomParity(assert, textAreaFixture, 'light', this.element.firstElementChild);
    });

    test('helper-text', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <TextArea @labelText='Text area label' @helperText='Helper text' />
        </template>,
      );
      assertDomParity(assert, textAreaFixture, 'helper-text', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, textAreaFixture, [
        'default',
        'with-value',
        'disabled',
        'invalid',
        'warn',
        'read-only',
        'light',
        'helper-text',
      ]);
    });
  });

  module('PasswordInput', function () {
    // The show/hide-password toggle's View/ViewOff icon loads its SVG
    // lazily via TrackedPromise - waitUntil before snapshotting, per the
    // lazy-icon-test-pattern gotcha.
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><PasswordInput @labelText='Password label' /></template>);
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, passwordInputFixture, 'default', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template><PasswordInput @labelText='Password label' @disabled={{true}} /></template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, passwordInputFixture, 'disabled', this.element.firstElementChild);
    });

    test('invalid', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <PasswordInput
            @labelText='Password label'
            @invalid={{true}}
            @invalidText='Invalid value'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, passwordInputFixture, 'invalid', this.element.firstElementChild);
    });

    test('warn', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <PasswordInput
            @labelText='Password label'
            @warn={{true}}
            @warnText='Warning message'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, passwordInputFixture, 'warn', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(
        <template><PasswordInput @labelText='Password label' @size='sm' /></template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, passwordInputFixture, 'size-sm', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, passwordInputFixture, [
        'default',
        'disabled',
        'invalid',
        'warn',
        'size-sm',
      ]);
    });
  });

  module('NumberInput', function () {
    // NumberInput's stepper icons (Add/Subtract) load their SVG lazily via
    // TrackedPromise - waitUntil for both before snapshotting the DOM, per
    // the lazy-icon-test-pattern gotcha (await settled() alone is not
    // reliable here).
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><NumberInput @label='Number label' /></template>);
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, numberInputFixture, 'default', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template><NumberInput @label='Number label' @disabled={{true}} /></template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, numberInputFixture, 'disabled', this.element.firstElementChild);
    });

    test('invalid', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <NumberInput
            @label='Number label'
            @invalid={{true}}
            @invalidText='Invalid value'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 3);
      assertDomParity(assert, numberInputFixture, 'invalid', this.element.firstElementChild);
    });

    test('warn', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <NumberInput @label='Number label' @warn={{true}} @warnText='Warning message' />
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 3);
      assertDomParity(assert, numberInputFixture, 'warn', this.element.firstElementChild);
    });

    test('read-only', async function (this: RenderingTestContext, assert) {
      await render(
        <template><NumberInput @label='Number label' @readOnly={{true}} /></template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, numberInputFixture, 'read-only', this.element.firstElementChild);
    });

    test('light', async function (this: RenderingTestContext, assert) {
      await render(<template><NumberInput @label='Number label' @light={{true}} /></template>);
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, numberInputFixture, 'light', this.element.firstElementChild);
    });

    test('hide-steppers', async function (this: RenderingTestContext, assert) {
      await render(
        <template><NumberInput @label='Number label' @hideSteppers={{true}} /></template>,
      );
      assertDomParity(assert, numberInputFixture, 'hide-steppers', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(<template><NumberInput @label='Number label' @size='sm' /></template>);
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, numberInputFixture, 'size-sm', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, numberInputFixture, [
        'default',
        'disabled',
        'invalid',
        'warn',
        'read-only',
        'light',
        'hide-steppers',
        'size-sm',
      ]);
    });
  });

  module('FluidTextInput', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><FluidTextInput @labelText='Fluid text input label' /></template>);
      assertDomParity(assert, fluidTextInputFixture, 'default', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FluidTextInput @labelText='Fluid text input label' @disabled={{true}} />
        </template>,
      );
      assertDomParity(assert, fluidTextInputFixture, 'disabled', this.element.firstElementChild);
    });

    test('invalid', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FluidTextInput
            @labelText='Fluid text input label'
            @invalid={{true}}
            @invalidText='Invalid value'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, fluidTextInputFixture, 'invalid', this.element.firstElementChild);
    });

    test('warn', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FluidTextInput
            @labelText='Fluid text input label'
            @warn={{true}}
            @warnText='Warning message'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, fluidTextInputFixture, 'warn', this.element.firstElementChild);
    });

    test('read-only', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FluidTextInput @labelText='Fluid text input label' @readOnly={{true}} />
        </template>,
      );
      assertDomParity(assert, fluidTextInputFixture, 'read-only', this.element.firstElementChild);
    });

    test('password', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FluidTextInput @labelText='Fluid password label' @isPassword={{true}} />
        </template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, fluidTextInputFixture, 'password', this.element.firstElementChild);
    });

    test('password-invalid', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FluidTextInput
            @labelText='Fluid password label'
            @isPassword={{true}}
            @invalid={{true}}
            @invalidText='Invalid value'
          />
        </template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(
        assert,
        fluidTextInputFixture,
        'password-invalid',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, fluidTextInputFixture, [
        'default',
        'disabled',
        'invalid',
        'warn',
        'read-only',
        'password',
        'password-invalid',
      ]);
    });
  });

  module('Search', function () {
    // The magnifier SearchIcon (and, once a value is present, the Close
    // clear-button icon) loads its SVG lazily via TrackedPromise - waitUntil
    // before snapshotting, per the lazy-icon-test-pattern gotcha.
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><Search @labelText='Search label' /></template>);
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, searchFixture, 'default', this.element.firstElementChild);
    });

    test('with-value', async function (this: RenderingTestContext, assert) {
      await render(
        <template><Search @labelText='Search label' @value='Search term' /></template>,
      );
      await waitUntil(() => this.element.querySelectorAll('svg').length >= 2);
      assertDomParity(assert, searchFixture, 'with-value', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template><Search @labelText='Search label' @disabled={{true}} /></template>,
      );
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, searchFixture, 'disabled', this.element.firstElementChild);
    });

    test('light', async function (this: RenderingTestContext, assert) {
      await render(<template><Search @labelText='Search label' @light={{true}} /></template>);
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, searchFixture, 'light', this.element.firstElementChild);
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(<template><Search @labelText='Search label' @size='sm' /></template>);
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, searchFixture, 'size-sm', this.element.firstElementChild);
    });

    test('size-lg', async function (this: RenderingTestContext, assert) {
      await render(<template><Search @labelText='Search label' @size='lg' /></template>);
      await waitUntil(() => this.element.querySelector('svg'));
      assertDomParity(assert, searchFixture, 'size-lg', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, searchFixture, [
        'default',
        'with-value',
        'disabled',
        'light',
        'size-sm',
        'size-lg',
      ]);
    });
  });

  module('FileUploaderButton', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderButton /></template>);
      assertDomParity(assert, fileUploaderButtonFixture, 'default', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderButton @disabled={{true}} /></template>);
      assertDomParity(
        assert,
        fileUploaderButtonFixture,
        'disabled',
        this.element.firstElementChild,
      );
    });

    test('button-kind-secondary', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderButton @buttonKind='secondary' /></template>);
      assertDomParity(
        assert,
        fileUploaderButtonFixture,
        'button-kind-secondary',
        this.element.firstElementChild,
      );
    });

    test('size-sm', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderButton @size='sm' /></template>);
      assertDomParity(assert, fileUploaderButtonFixture, 'size-sm', this.element.firstElementChild);
    });

    test('multiple', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderButton @multiple={{true}} /></template>);
      assertDomParity(assert, fileUploaderButtonFixture, 'multiple', this.element.firstElementChild);
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, fileUploaderButtonFixture, [
        'default',
        'disabled',
        'button-kind-secondary',
        'size-sm',
        'multiple',
      ]);
    });
  });

  module('FileUploaderDropContainer', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderDropContainer /></template>);
      assertDomParity(
        assert,
        fileUploaderDropContainerFixture,
        'default',
        this.element.firstElementChild,
      );
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderDropContainer @disabled={{true}} /></template>);
      assertDomParity(
        assert,
        fileUploaderDropContainerFixture,
        'disabled',
        this.element.firstElementChild,
      );
    });

    test('multiple', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploaderDropContainer @multiple={{true}} /></template>);
      assertDomParity(
        assert,
        fileUploaderDropContainerFixture,
        'multiple',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, fileUploaderDropContainerFixture, [
        'default',
        'disabled',
        'multiple',
      ]);
    });
  });

  module('FileUploader', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      await render(<template><FileUploader @filenameStatus='edit' /></template>);
      assertDomParity(assert, fileUploaderFixture, 'default', this.element.firstElementChild);
    });

    test('with-labels', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FileUploader
            @filenameStatus='edit'
            @labelTitle='Upload files'
            @labelDescription='Max file size 500kb'
          />
        </template>,
      );
      assertDomParity(assert, fileUploaderFixture, 'with-labels', this.element.firstElementChild);
    });

    test('disabled', async function (this: RenderingTestContext, assert) {
      await render(
        <template><FileUploader @filenameStatus='edit' @disabled={{true}} /></template>,
      );
      assertDomParity(assert, fileUploaderFixture, 'disabled', this.element.firstElementChild);
    });

    test('button-kind-secondary', async function (this: RenderingTestContext, assert) {
      await render(
        <template>
          <FileUploader @filenameStatus='edit' @buttonKind='secondary' />
        </template>,
      );
      assertDomParity(
        assert,
        fileUploaderFixture,
        'button-kind-secondary',
        this.element.firstElementChild,
      );
    });

    test('every fixture variant is covered', function (assert) {
      assertFullCoverage(assert, fileUploaderFixture, [
        'default',
        'with-labels',
        'disabled',
        'button-kind-secondary',
      ]);
    });
  });
});
