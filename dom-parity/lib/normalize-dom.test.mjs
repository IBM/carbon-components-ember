import assert from 'node:assert/strict';
import { test } from 'node:test';

import { JSDOM } from 'jsdom';

import { diffNormalized } from './diff-normalized.mjs';
import { normalizeElement } from './normalize-dom.mjs';

// Glimmer renders a template's whitespace as text nodes of its own.
const render = (...nodes) => {
  const { document } = new JSDOM('<!doctype html><body></body>').window;
  const append = (parent, node) => {
    if (typeof node === 'string') parent.append(document.createTextNode(node));
    else if (node === null) parent.append(document.createComment(''));
    else {
      const [tag, ...children] = node;
      const element = document.createElement(tag);
      children.forEach((child) => append(element, child));
      parent.append(element);
    }
  };
  nodes.forEach((node) => append(document.body, node));
  return document.body.querySelector('*');
};

test('records whitespace at the edges of a run of text', () => {
  const tree = normalizeElement(render(['a', '\n  ', 'Link', null, '\n']));

  assert.deepEqual(tree.children, [
    { type: 'text', text: 'Link', whitespace: 'both' },
  ]);
});

test('ignores whitespace between elements, unless it is all the content', () => {
  const tree = normalizeElement(
    render(['div', '\n  ', ['span', '\n  '], '\n  ', ['span'], '\n']),
  );

  assert.deepEqual(
    tree.children.map((child) => child.children),
    [[{ type: 'text', text: '', whitespace: 'only' }], []],
  );
});

test('records whitespace beside the root', () => {
  const tree = normalizeElement(render('  ', ['button', 'Save'], '\n'));

  assert.equal(tree.whitespaceAround, 'both');
});

test('reads the styles React sets in jsdom as Chrome writes them', () => {
  const span = render(['span']);
  // As React sets `style={{ WebkitLineClamp: 2, transform: '…' }}`.
  span.style.WebkitLineClamp = '2';
  span.style.transform = 'translate(0px, 0px)';

  assert.deepEqual(normalizeElement(span).style, {
    '-webkit-line-clamp': '2',
    transform: 'translate(0px, 0px)',
  });
});

test("keeps a browser's styles, writing a one-argument translate in full", () => {
  const span = render(['span']);
  span.setAttribute(
    'style',
    '-webkit-line-clamp: 3; transform: translate(-50%, 4px) translateX(2px) translate(10px)',
  );

  assert.deepEqual(normalizeElement(span).style, {
    '-webkit-line-clamp': '3',
    transform: 'translate(-50%, 4px) translateX(2px) translate(10px, 0px)',
  });
});

test('reports whitespace React has no counterpart for', () => {
  const react = normalizeElement(render(['a', 'Link']));
  const ember = normalizeElement(render(' ', ['a', 'Link', '\n']));

  assert.deepEqual(diffNormalized(react, ember), [
    {
      path: 'a.whitespaceAround',
      kind: 'whitespace',
      detail: { react: 'none', ember: 'leading' },
    },
    {
      path: 'a > text("Link")[0].whitespace',
      kind: 'whitespace',
      detail: { react: 'none', ember: 'trailing' },
    },
  ]);
});
