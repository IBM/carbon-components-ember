import { fn as bind } from '@ember/helper';
import { trackedMap, trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import TreeView from './tree-view.gts';
import DocumentIcon from './icons/document.ts';
import Folder from './icons/folder.ts';

import type { TreeViewArgs, TreeViewSignature } from './tree-view.gts';
import type Icon from './icon.gts';
import type { TOC } from '@ember/component/template-only';

// Parity gaps with Carbon React's TreeView stories:
// - `WithLinks`: TreeNode has no `href` arg.
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
  children?: NodeDef[];
};

type StoryArgs = TreeViewArgs & {
  nodes: NodeDef[];
  withIcons?: boolean;
};

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
        @isExpanded={{isExpanded node @expansion}}
        @onToggle={{if @expansion (bind @expansion.set node.id)}}
        as |Child|
      >
        <TreeNodes
          @nodes={{node.children}}
          @Node={{Child}}
          @withIcons={{@withIcons}}
          @expansion={{@expansion}}
        />
      </@Node>
    {{else}}
      <@Node
        @id={{node.id}}
        @label={{node.label}}
        @disabled={{node.disabled}}
        @icon={{if @withIcons node.icon}}
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

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/TreeView',
  component: TreeView,
  parameters: {
    docs: {
      description: {
        component:
          "TreeView is used to render a hierarchical list of nested items that can be expanded or collapsed. `TreeView` and each node yield a bound `TreeNode` component that can be nested arbitrarily deep to build out the tree; select or activate a node by clicking on it.\n\nBy default only a single node can be selected at a time. `@multiselect` allows selecting additional nodes by clicking while holding <kbd>Cmd</kbd>/<kbd>Ctrl</kbd>. `@onSelect` is called with the array of selected node ids and the node that triggered the change, and `@onActivate` with the id of the node that received keyboard/click focus.\n\nA disabled node can't be selected or focused (it is removed from the tab order) but still renders, dimmed; on a parent node its toggle caret stays usable so its descendants remain reachable.",
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
    onSelect: fn(),
    onActivate: fn(),
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
      <div style="margin-bottom: 1rem">
        <Button @onClick={{expandAll}}>Expand all</Button>
        <Button @onClick={{collapseAll}}>Collapse all</Button>
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
      <Button @onClick={{toggleCloud}}>Toggle "Cloud computing"</Button>
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
