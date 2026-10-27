import { trackedMap, trackedObject } from '@ember/reactive/collections';
import { expect, fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import TreeView from './tree-view.gts';
import DocumentIcon from './icons/document.ts';
import Folder from './icons/folder.ts';

import type { TreeViewSignature } from './tree-view.gts';
import type Icon from './icon.gts';
import type { TOC } from '@ember/component/template-only';
import '#storybook/styles/tree-view.css';

// Parity gaps with Carbon React's TreeView stories:
// - TreeNode has no `value` arg (selection reports node ids), and labels
//   are plain strings.
// - In `WithComplexNesting`, React's "TreeNode wrapped in a <div>" pattern
//   isn't reproduced: a `<div>` inside the node's `role="group"` list is
//   invalid markup; the "TreeNode rendered from another component" pattern
//   is.
// - React's `isExpanded` re-syncs whenever the prop changes; in Ember it
//   only seeds the node unless `@onToggle` is passed too (see
//   `WithControlledExpansion`).

type TreeNodeComponent = TreeViewSignature['Blocks']['default'][0];

type NodeDef = {
  id: string;
  label: string;
  isExpanded?: boolean;
  disabled?: boolean;
  icon?: typeof Icon;
  href?: string;
  children?: NodeDef[];
};

type StoryArgs = TreeViewSignature['Args'] & {
  nodes: NodeDef[];
  withIcons?: boolean;
};

// So the story's links only pretend to navigate, as in Carbon React's.
const stayOnPage = (event: MouseEvent) => event.preventDefault();
const noop = () => {};

// Expansion state for WithControlledExpansion, keyed by node id.
type Expansion = {
  get(id: string): boolean | undefined;
  set(id: string, expanded: boolean): void;
};

const isExpanded = (
  node: NodeDef,
  expansion: Expansion | undefined,
): boolean | undefined => expansion?.get(node.id) ?? node.isExpanded;

// Renders `@nodes` (recursively) with the bound TreeNode component the
// TreeView, or the parent node, yields.
const TreeNodes: TOC<{
  Args: {
    nodes: NodeDef[];
    Node: TreeNodeComponent;
    withIcons?: boolean;
    withLinks?: boolean;
    expansion?: Expansion;
  };
}> = <template>
  {{#each @nodes as |node|}}
    {{#if node.children}}
      <@Node
        @id={{node.id}}
        @label={{node.label}}
        @disabled={{node.disabled}}
        @icon={{if @withIcons node.icon}}
        @href={{if @withLinks node.href}}
        @isExpanded={{isExpanded node @expansion}}
        @onToggle={{if @expansion (fn @expansion.set node.id)}}
        {{on "click" (if @withLinks stayOnPage noop)}}
        as |Child|
      >
        <TreeNodes
          @nodes={{node.children}}
          @Node={{Child}}
          @withIcons={{@withIcons}}
          @withLinks={{@withLinks}}
          @expansion={{@expansion}}
        />
      </@Node>
    {{else}}
      <@Node
        @id={{node.id}}
        @label={{node.label}}
        @disabled={{node.disabled}}
        @icon={{if @withIcons node.icon}}
        @href={{if @withLinks node.href}}
        {{on "click" (if @withLinks stayOnPage noop)}}
      />
    {{/if}}
  {{/each}}
</template>;

const leaf = (id: string, label: string): NodeDef => ({
  id,
  label,
  icon: DocumentIcon,
});
const parent = (
  id: string,
  label: string,
  children: NodeDef[],
  extra: Partial<NodeDef> = {},
): NodeDef => ({ id, label, icon: Folder, children, ...extra });

const NODES: NodeDef[] = [
  leaf('1', 'Application development and integration solutions'),
  leaf('2', 'Blockchain'),
  parent('3', 'Business automation', [
    leaf('3-1', 'Business process automation'),
    leaf('3-2', 'Business process mapping'),
  ]),
  leaf('4', 'Business operations'),
  parent(
    '5',
    'Cloud computing',
    [
      leaf('5-1', 'Containers'),
      leaf('5-2', 'Databases'),
      parent(
        '5-3',
        'DevOps',
        [
          leaf('5-4', 'Solutions'),
          parent('5-5', 'Case studies', [leaf('5-6', 'Resources')], {
            isExpanded: true,
          }),
        ],
        { isExpanded: true },
      ),
    ],
    { isExpanded: true },
  ),
  parent('6', 'Data & Analytics', [
    leaf('6-1', 'Big data'),
    leaf('6-2', 'Business intelligence'),
  ]),
  parent(
    '7',
    'Models',
    [
      leaf('7-1', 'Audit'),
      leaf('7-2', 'Monthly data'),
      parent(
        '8',
        'Data warehouse',
        [leaf('8-1', 'Report samples'), leaf('8-2', 'Sales performance')],
        { isExpanded: true },
      ),
    ],
    { isExpanded: true, disabled: true },
  ),
];

const link = (node: NodeDef, href: string): NodeDef => ({ ...node, href });

const LINK_NODES: NodeDef[] = [
  link(leaf('1', 'Artificial intelligence'), '/artificial-intelligence'),
  link(leaf('2', 'Blockchain'), '/blockchain'),
  link(
    parent('3', 'Business automation', [
      link(
        leaf('3-1', 'Business process automation'),
        '/business-process-automation',
      ),
      link(
        leaf('3-2', 'Business process mapping'),
        '/business-process-mapping',
      ),
    ]),
    '/business-automation',
  ),
  link(leaf('4', 'Business operations'), '/business-operations'),
  link(
    parent(
      '5',
      'Cloud computing',
      [
        link(leaf('5-1', 'Containers'), '/containers'),
        link(leaf('5-2', 'Databases'), '/databases'),
        link(
          parent(
            '5-3',
            'DevOps',
            [
              link(leaf('5-4', 'Solutions'), '/solutions'),
              link(
                parent(
                  '5-5',
                  'Case studies',
                  [link(leaf('5-6', 'Resources'), '/resources')],
                  { isExpanded: true },
                ),
                '/case-studies',
              ),
            ],
            { isExpanded: true },
          ),
          '/devops',
        ),
      ],
      { isExpanded: true },
    ),
    '/cloud-computing',
  ),
  link(
    parent('6', 'Data & Analytics', [
      link(leaf('6-1', 'Big data'), '/big-data'),
      link(leaf('6-2', 'Business intelligence'), '/business-intelligence'),
    ]),
    '/data-analytics',
  ),
  link(
    parent(
      '7',
      'Models',
      [
        link(leaf('7-1', 'Audit'), '/audit'),
        link(leaf('7-2', 'Monthly data'), '/monthly-data'),
        link(
          parent(
            '8',
            'Data warehouse',
            [
              link(leaf('8-1', 'Report samples'), '/report-samples'),
              link(leaf('8-2', 'Sales performance'), '/sales-performance'),
            ],
            { isExpanded: true },
          ),
          '/data-warehouse',
        ),
      ],
      { isExpanded: true, disabled: true },
    ),
    '/models',
  ),
];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/TreeView',
  component: TreeView,
  parameters: {
    docs: {
      description: {
        component:
          "TreeView is used to render a hierarchical list of nested items that can be expanded or collapsed. `TreeView` and each node yield a bound `TreeNode` component that can be nested arbitrarily deep to build out the tree; select or activate a node by clicking on it.\n\nThe tree is a single tab stop. <kbd>Up</kbd>/<kbd>Down</kbd> move between visible nodes and <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last; <kbd>Right</kbd> expands a parent, then moves into it, and <kbd>Left</kbd> collapses it, or moves to the parent; <kbd>Enter</kbd> selects a node (and toggles a parent), <kbd>Space</kbd> selects it.\n\nA node with `@href`, or `@route` for one of the app's routes, is a link: Enter and Space follow it, and it's still selected. A route node is the active node while its route is current.\n\nBy default only a single node can be selected at a time. `@multiselect` allows selecting additional nodes by clicking while holding <kbd>Cmd</kbd>/<kbd>Ctrl</kbd>. `@onSelect` is called with the array of selected node ids and the node that triggered the change, and `@onActivate` with the id of the node that received keyboard/click focus.\n\nA disabled node can't be selected or focused (it is removed from the tab order) but still renders, dimmed; on a parent node its toggle caret stays usable so its descendants remain reachable.",
      },
    },
  },
  args: {
    label: 'Tree View',
    hideLabel: false,
    multiselect: false,
    size: 'sm',
    nodes: NODES,
    withIcons: false,
    onSelect: spy(),
    onActivate: spy(),
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm'] },
  },
  render: (args: StoryArgs) => <template>
    <TreeView
      @label={{args.label}}
      @hideLabel={{args.hideLabel}}
      @multiselect={{args.multiselect}}
      @size={{args.size}}
      @selected={{args.selected}}
      @onSelect={{args.onSelect}}
      @onActivate={{args.onActivate}}
      as |Node|
    >
      <TreeNodes
        @nodes={{args.nodes}}
        @Node={{Node}}
        @withIcons={{args.withIcons}}
      />
    </TreeView>
  </template>,
});

export const Default = meta.story();

Default.test(
  'selects a node and toggles a parent',
  async ({ canvas, userEvent, args }) => {
    const blockchain = canvas.getByRole('treeitem', { name: 'Blockchain' });
    await userEvent.click(blockchain);
    await expect(blockchain).toHaveAttribute('aria-selected', 'true');
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      ['2'],
      expect.anything(),
    );
    await expect(args.onActivate).toHaveBeenLastCalledWith('2');

    const automation = canvas.getByRole('treeitem', {
      name: /Business automation/,
    });
    await expect(automation).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(
      automation.querySelector<HTMLElement>('.cds--tree-parent-node__toggle')!,
    );
    await expect(automation).toHaveAttribute('aria-expanded', 'true');
  },
);

Default.test(
  'moves between nodes with the arrow keys',
  async ({ canvas, userEvent }) => {
    const items = canvas.getAllByRole('treeitem');
    await expect(items.filter((item) => item.tabIndex === 0)).toHaveLength(1);

    await userEvent.tab();
    await expect(items[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(items[1]).toHaveFocus();
    await expect(items[1]).toHaveAttribute('tabindex', '0');
    await userEvent.keyboard('{Home}');
    await expect(items[0]).toHaveFocus();
  },
);

Default.test(
  'disabled nodes cannot be selected',
  async ({ canvas, userEvent, args }) => {
    const models = canvas.getByRole('treeitem', { name: /^Models/ });
    await expect(models).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(
      models.querySelector('.cds--tree-node__label__text')!,
    );
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
);

export const WithIcons = meta.story({
  args: {
    withIcons: true,
  },
});

export const Multiselect = meta.story({
  args: {
    multiselect: true,
  },
});

Multiselect.test(
  'Ctrl/Cmd-click adds to the selection',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('treeitem', { name: 'Blockchain' }));
    await userEvent.keyboard('{Control>}');
    await userEvent.click(
      canvas.getByRole('treeitem', { name: 'Business operations' }),
    );
    await userEvent.keyboard('{/Control}');
    await expect(args.onSelect).toHaveBeenLastCalledWith(
      ['2', '4'],
      expect.anything(),
    );
  },
);

export const ExtraSmall = meta.story({
  name: 'Size xs',
  args: {
    size: 'xs',
  },
});

// Passing `@onToggle` alongside `@isExpanded` makes a node fully
// controlled: its expansion always reflects `@isExpanded`. Here the
// expansion of every parent lives in a map, updated from `@onToggle` and
// from the buttons.
export const WithControlledExpansion = meta.story({
  args: {
    withIcons: true,
  },
  render: (args: StoryArgs) => {
    const map = trackedMap<string, boolean>();
    const expansion: Expansion = {
      get: (id) => map.get(id),
      set: (id, expanded) => {
        map.set(id, expanded);
      },
    };
    const setAll = (expanded: boolean) => {
      const visit = (nodes: NodeDef[]) =>
        nodes.forEach((node) => {
          if (node.children) {
            expansion.set(node.id, expanded);
            visit(node.children);
          }
        });
      visit(args.nodes);
    };
    const expandAll = () => setAll(true);
    const collapseAll = () => setAll(false);

    return <template>
      <div class="tree-view-story__controls">
        <Button {{on "click" expandAll}}>Expand all</Button>
        <Button {{on "click" collapseAll}}>Collapse all</Button>
      </div>
      <TreeView
        @label={{args.label}}
        @size={{args.size}}
        @onSelect={{args.onSelect}}
        as |Node|
      >
        <TreeNodes
          @nodes={{args.nodes}}
          @Node={{Node}}
          @withIcons={{args.withIcons}}
          @expansion={{expansion}}
        />
      </TreeView>
    </template>;
  },
});

WithControlledExpansion.test(
  'expands and collapses every node',
  async ({ canvas, userEvent }) => {
    const automation = canvas.getByRole('treeitem', {
      name: /Business automation/,
    });
    await expect(automation).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await expect(automation).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse all' }));
    await expect(automation).toHaveAttribute('aria-expanded', 'false');
    await expect(
      canvas.getByRole('treeitem', { name: /Cloud computing/ }),
    ).toHaveAttribute('aria-expanded', 'false');
  },
);

// A single controlled node, driven both by its own caret and by a button
// outside the tree.
export const ControlledNode = meta.story({
  name: 'Controlled node',
  render: (args: StoryArgs) => {
    const state = trackedObject({ cloudExpanded: true });
    const toggleCloud = () => {
      state.cloudExpanded = !state.cloudExpanded;
    };
    const onToggle = (expanded: boolean) => {
      state.cloudExpanded = expanded;
    };

    return <template>
      <Button {{on "click" toggleCloud}}>Toggle "Cloud computing"</Button>
      <br />
      <br />
      <TreeView @label={{args.label}} as |Node|>
        <Node
          @id="cloud"
          @label="Cloud computing"
          @isExpanded={{state.cloudExpanded}}
          @onToggle={{onToggle}}
          as |Child|
        >
          <Child @id="iaas" @label="IaaS" />
          <Child @id="paas" @label="PaaS" />
        </Node>
        <Node @id="security" @label="Security" />
      </TreeView>
    </template>;
  },
});

const NestedNode: TOC<{ Args: { Node: TreeNodeComponent } }> = <template>
  <@Node @id="21" @label="Nested" />
</template>;

export const WithComplexNesting = meta.story({
  args: {
    hideLabel: true,
    label: 'Tree View with Complex Nesting',
    multiselect: true,
    selected: ['1-1'],
  },
  render: (args: StoryArgs) => <template>
    <TreeView
      @label={{args.label}}
      @hideLabel={{args.hideLabel}}
      @multiselect={{args.multiselect}}
      @selected={{args.selected}}
      @onSelect={{args.onSelect}}
      as |Node|
    >
      <Node @id="1" @label="A.I." @isExpanded={{true}} as |Child|>
        <Child @id="1-1" @label="Sub 1" />
        <Child @id="1-2" @label="Sub 2 (direct child)" as |GrandChild|>
          <GrandChild @id="1-2-1" @label="Sub 2.1" />
        </Child>
      </Node>
      <Node @id="2" @label="Analytics" @isExpanded={{true}} as |Child|>
        {{! A TreeNode rendered from another component }}
        <NestedNode @Node={{Child}} />
      </Node>
      <Node @id="3" @label="Trust" />
    </TreeView>
  </template>,
});

export const WithLinks = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "A node with `@href` is a link, or with `@route` a link to one of the app's routes, which is the active node while its route is current. Enter follows it. Here the links only pretend to navigate, and the page shows the selected one.",
      },
    },
  },
  args: { hideLabel: true },
  render: (args: StoryArgs) => {
    const page = trackedObject({
      current: 'Artificial intelligence',
      id: '1',
    });
    const selectPage: TreeViewSignature['Args']['onSelect'] = (
      selected,
      node,
    ) => {
      page.current = node.args.label;
      page.id = node.nodeId;
      args.onSelect?.(selected, node);
    };
    const selectedPage = () => [page.id];
    return <template>
      <div class="tree-view-story__page">
        <TreeView
          @label={{args.label}}
          @hideLabel={{args.hideLabel}}
          @size={{args.size}}
          @active={{page.id}}
          @selected={{(selectedPage)}}
          @onSelect={{selectPage}}
          as |Node|
        >
          <TreeNodes
            @nodes={{LINK_NODES}}
            @Node={{Node}}
            @withIcons={{true}}
            @withLinks={{true}}
          />
        </TreeView>
        <main>
          <h3>The current page is: {{page.current}}</h3>
        </main>
      </div>
    </template>;
  },
});

WithLinks.test(
  'shows the clicked link as the current page',
  async ({ canvas, userEvent }) => {
    const blockchain = canvas.getByRole('treeitem', { name: 'Blockchain' });
    await userEvent.click(blockchain);
    await expect(
      canvas.getByText('The current page is: Blockchain'),
    ).toBeInTheDocument();
    // One current page, as in Carbon React's story.
    await expect(blockchain).toHaveAttribute('aria-current', 'page');
    await expect(
      canvas.getByRole('treeitem', { name: 'Artificial intelligence' }),
    ).not.toHaveAttribute('aria-current');
  },
);
