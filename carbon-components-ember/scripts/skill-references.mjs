/**
 * Writes the component references of the carbon-components-ember skill
 * from a built Storybook: `references/components.md` lists every docs page,
 * and `references/components/<name>.md` holds one page's import, arguments,
 * blocks and examples, as the components manifest has them. A page is named
 * after its component, so agents can open it without the list.
 *
 * Usage: node scripts/skill-references.mjs [storybook-static]
 */

import fs from 'node:fs';
import path from 'node:path';

const storybook = process.argv[2] ?? 'storybook-static';
const skill = path.join(
  import.meta.dirname,
  '../skills/carbon-components-ember',
);
const references = path.join(skill, 'references');

const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(storybook, file), 'utf-8'));

const { components } = readJson('manifests/components.json');
const { entries } = readJson('index.json');

const titles = new Map(
  Object.values(entries).map((entry) => [
    entry.id.slice(0, entry.id.indexOf('--')),
    entry.title,
  ]),
);

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s/]+/g, '-')
    .toLowerCase();

/**
 * The barrel a page's import names: `components`, `ai-chat`, `charts` or
 * `ibm-products`.
 */
const barrelOf = (component) =>
  component.import?.match(/from 'carbon-components-ember\/([\w-]+)'/)?.[1] ??
  'components';

/**
 * A page's file name: its component in kebab case (`date-picker`). A name
 * another barrel also has starts with its barrel (`ai-chat-code-snippet`),
 * and a component with several pages ends with the page's name
 * (`data-table-selection`), except on the component's own page.
 */
function fileName(component, title) {
  const barrel = barrelOf(component);
  const namesakes = Object.values(components).filter(
    (other) => other.name === component.name,
  );
  let name = kebab(component.name);
  if (
    barrel !== 'components' &&
    namesakes.some((other) => barrelOf(other) !== barrel)
  ) {
    name = `${barrel}-${name}`;
  }
  const page = kebab(title.split('/').at(-1));
  if (
    page !== kebab(component.name) &&
    namesakes.filter((other) => barrelOf(other) === barrel).length > 1
  ) {
    name = `${name}-${page}`;
  }
  return name;
}

/** The first sentence of a description, for the list. */
function summary(description = '') {
  const paragraph = description
    .trim()
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, ' ');
  return paragraph.match(/^.+?(?<!\be\.g|\bi\.e)\.(?=\s|$)/)?.[0] ?? paragraph;
}

function page(component, title) {
  const lines = [`# ${title}`, ''];
  if (component.description) lines.push(component.description.trim(), '');
  if (component.import) lines.push('```js', component.import, '```', '');
  if (component.apiDescription) lines.push(component.apiDescription.trim(), '');
  if (component.stories?.length) {
    lines.push(
      '## Examples',
      '',
      "Arguments written as `{{@name}}` are the story's controls; pass your own values.",
      '',
    );
    for (const story of component.stories) {
      lines.push(`### ${story.name}`, '');
      if (story.description) lines.push(story.description.trim(), '');
      if (story.snippet) lines.push('```gts', story.snippet.trim(), '```', '');
    }
  }
  return lines.join('\n');
}

const groups = new Map();
fs.rmSync(path.join(references, 'components'), {
  recursive: true,
  force: true,
});
fs.mkdirSync(path.join(references, 'components'), { recursive: true });

const files = new Map();
for (const [id, component] of Object.entries(components)) {
  const title = titles.get(id);
  if (!title) throw new Error(`${id} isn't in ${storybook}/index.json`);
  const [group, ...rest] = title.split('/');
  const name = rest.join('/') || group;
  const file = `${fileName(component, title)}.md`;
  if (files.has(file)) {
    throw new Error(`${id} and ${files.get(file)} would both be ${file}`);
  }
  files.set(file, id);

  fs.writeFileSync(
    path.join(references, 'components', file),
    page(component, name),
  );
  if (!groups.has(group)) groups.set(group, []);
  groups
    .get(group)
    .push({ name, id, file, summary: summary(component.description) });
}

if (!groups.size) throw new Error(`${storybook} has no components`);

const list = [
  '# Components',
  '',
  "Every docs page, with the first sentence of its description. Read a page for the component's import, arguments, blocks and examples.",
];
for (const [group, pages] of [...groups].sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  list.push('', `## ${group}`, '');
  // By id, so a page's subpages follow it ("Prompt line/Autocomplete"
  // before "Prompt line shell").
  for (const { name, file, summary } of pages.sort((a, b) =>
    a.id < b.id ? -1 : 1,
  )) {
    list.push(
      `- [${name}](components/${file})${summary ? `: ${summary}` : ''}`,
    );
  }
}
fs.writeFileSync(
  path.join(references, 'components.md'),
  `${list.join('\n')}\n`,
);

// Every relative link in the skill must resolve once it's installed.
for (const file of fs.readdirSync(skill, { recursive: true })) {
  if (!file.endsWith('.md')) continue;
  const text = fs.readFileSync(path.join(skill, file), 'utf-8');
  for (const [, link] of text.matchAll(/\]\(((?![a-z]+:|#)[^)\s]+)\)/g)) {
    const target = path.join(skill, path.dirname(file), link.split('#')[0]);
    if (!fs.existsSync(target)) {
      throw new Error(`${file} links to ${link}, which doesn't exist`);
    }
  }
}

console.log(
  `Wrote ${Object.keys(components).length} component references to ${path.relative(process.cwd(), references)}`,
);
