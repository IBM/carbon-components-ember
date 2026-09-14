import { module, test } from 'qunit';
import { evaluateShowMoreButton } from 'carbon-components-ember/components/ai-chat/-code-snippet/layout-utils';

function containerWithHeight(height: number): ParentNode {
  return {
    querySelector: () => ({ getBoundingClientRect: () => ({ height }) }) as unknown as Element,
  } as unknown as ParentNode;
}

module('Unit | Utility | ai-chat/code-snippet/layout-utils', function () {
  test('shouldShowButton and shouldCollapse are mutually exclusive when maxCollapsed is well below the minExpanded default', function (assert) {
    // A real, supported case: a much smaller collapsed cap than the default
    // minExpanded threshold (16 rows). Any content between the two -
    // exercised here at 100px, comfortably inside (3 * 16, 16 * 16] = (48, 256] -
    // both needs the show-more affordance and would otherwise trip the
    // auto-collapse guard the instant it's expanded.
    const result = evaluateShowMoreButton({
      container: containerWithHeight(100),
      rowHeight: 16,
      expanded: true,
      maxCollapsed: 3,
      maxExpanded: 0,
      minExpanded: 16,
    });

    assert.true(result.shouldShowButton, 'content still exceeds the collapsed cap');
    assert.false(
      result.shouldCollapse,
      'expanding must not immediately snap back to collapsed while the button is still needed',
    );
  });

  test('shouldCollapse still fires once content genuinely no longer needs the expand affordance', function (assert) {
    const result = evaluateShowMoreButton({
      container: containerWithHeight(40),
      rowHeight: 16,
      expanded: true,
      maxCollapsed: 3,
      maxExpanded: 0,
      minExpanded: 16,
    });

    assert.false(result.shouldShowButton, 'content fits within the collapsed cap');
    assert.true(result.shouldCollapse, 'auto-collapse is still expected once genuinely short');
  });
});
