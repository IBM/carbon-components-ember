import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import Button from 'carbon-components-ember/components/button';
import Tag from 'carbon-components-ember/components/tag';
import Loading from 'carbon-components-ember/components/loading';
import { normalizeElement } from '../../../dom-parity/lib/normalize-dom.mjs';
import {
  diffNormalized,
  applyKnownDifferences,
} from '../../../dom-parity/lib/diff-normalized.mjs';
import knownDifferences from '../../../dom-parity/known-differences.json';
import buttonFixture from '../../../dom-parity/fixtures/Button.json';
import tagFixture from '../../../dom-parity/fixtures/Tag.json';
import loadingFixture from '../../../dom-parity/fixtures/Loading.json';

/**
 * Compares an Ember-rendered root element against a fixture captured from a
 * pinned @carbon/react release (see dom-parity/generate.mjs). Differences
 * pre-approved in dom-parity/known-differences.json (real, tracked gaps)
 * are filtered out before asserting - a change here should either fix the
 * component or add a new, reasoned entry to that file, not both.
 */
function assertDomParity(
  assert: Assert,
  fixture: { component: string; carbonReactVersion: string; dom: object },
  rootElement: Element | null,
) {
  if (!rootElement) {
    assert.ok(false, `${fixture.component}: nothing rendered`);
    return;
  }

  const emberTree = normalizeElement(rootElement);
  const differences = diffNormalized(fixture.dom, emberTree);
  const known =
    (knownDifferences as Record<string, Array<{ path: string; reason: string }>>)[
      fixture.component
    ] ?? [];
  const unexpected = applyKnownDifferences(differences, known);

  assert.deepEqual(
    unexpected,
    [],
    `${fixture.component} should render the same tag/classes/attributes/style as ` +
      `@carbon/react@${fixture.carbonReactVersion}, modulo the documented gaps in ` +
      `dom-parity/known-differences.json`,
  );
}

module('DOM parity | Carbon React', function (hooks) {
  setupRenderingTest(hooks);

  test('Button', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <Button @type='primary' @size='lg'>Button</Button>
      </template>,
    );
    assertDomParity(assert, buttonFixture, this.element.firstElementChild);
  });

  test('Tag', async function (this: RenderingTestContext, assert) {
    await render(<template><Tag @type='gray'>Tag content</Tag></template>);
    assertDomParity(assert, tagFixture, this.element.firstElementChild);
  });

  test('Loading', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <Loading
          @description='Active loading indicator'
          @withOverlay={{false}}
        />
      </template>,
    );
    assertDomParity(assert, loadingFixture, this.element.firstElementChild);
  });
});
