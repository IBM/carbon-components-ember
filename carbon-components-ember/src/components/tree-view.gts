/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { concat } from '@ember/helper';
import type { WithBoundArgs } from '@glint/template';
import style from 'ember-style-modifier';
import { RovingFocus } from '../utils/roving-focus.ts';
import type Icon from './icon.gts';

const labelOffset = (offset: number) => ({
  marginInlineStart: `-${offset}rem`,
  paddingInlineStart: `${offset}rem`,
});

export interface TreeNodeSignature {
  Element: HTMLLIElement;
  Args: {
    treeView: TreeView;
    id?: string;
    label: string;
    disabled?: boolean;
    /**
     * Whether the node is expanded. Uncontrolled (just sets the initial
     * state) unless `@onToggle` is also passed, in which case this becomes
     * the source of truth and the consumer is expected to update it from
     * `@onToggle` — see the "Controlled expansion" docs example.
     */
    isExpanded?: boolean;
    onToggle?: (expanded: boolean, node: TreeNode) => void;
    /**
     * Icon rendered before the node's label, e.g. `Folder`/`Document` from
     * `carbon-components-ember/icons`.
     */
    icon?: typeof Icon;
    /**
     * Nesting depth of this node within the tree, starting at 0 for
     * top-level nodes. Set automatically when nodes are yielded — do not
     * pass this manually.
     */
    depth?: number;
    /**
     * Whether an ancestor is collapsed, which takes the node out of
     * keyboard navigation. Set automatically when nodes are yielded — do
     * not pass this manually.
     */
    hidden?: boolean;
    /**
     * Whether an ancestor has an icon, and how many of Carbon's 0.5rem
     * indents that gives this node. Set automatically when nodes are
     * yielded — do not pass these manually.
     */
    underIcon?: boolean;
    iconIndents?: number;
  };
  Blocks: {
    default: [TreeNode: WithBoundArgs<typeof TreeNode, 'treeView'>];
  };
}

class TreeNode extends Component<TreeNodeSignature> {
  @tracked uncontrolledExpanded: boolean;

  constructor(owner: Owner, args: TreeNodeSignature['Args']) {
    super(owner, args);
    this.uncontrolledExpanded = args.isExpanded ?? false;
  }

  get expanded() {
    // `@isExpanded` only sets the initial state unless `@onToggle` is also
    // passed, in which case the node becomes fully controlled — otherwise
    // a plain `@isExpanded={{true}}` (not bound to mutable state) would
    // permanently lock the node open/closed instead of just seeding it.
    if (this.args.onToggle) {
      return this.args.isExpanded ?? false;
    }
    return this.uncontrolledExpanded;
  }

  get nodeId() {
    return this.args.id ?? `tree-node-${guidFor(this)}`;
  }

  get isSelected() {
    return this.args.treeView.isSelected(this.nodeId);
  }

  get isActive() {
    return this.args.treeView.isActive(this.nodeId);
  }

  get depth() {
    return this.args.depth ?? 0;
  }

  get childDepth() {
    return this.depth + 1;
  }

  get childUnderIcon() {
    return Boolean(this.args.underIcon || this.args.icon);
  }

  get childIconIndents() {
    return (this.args.iconIndents ?? 0) + (this.childUnderIcon ? 1 : 0);
  }

  // Mirrors upstream Carbon's per-node negative margin/padding trick so the
  // row's hover/selected background spans the full row width (flush with
  // the tree's left edge) instead of just starting where the label text
  // begins. Each level adds 1rem, and Carbon's CSS 0.5rem more under a node
  // with an icon; a leaf has 2.5rem of its own, 2rem with an icon. Carbon
  // React keys the 0.5rem on the node's own icon, which only fits trees
  // where every node has one or none does.
  get indent() {
    return this.depth + (this.args.iconIndents ?? 0) * 0.5;
  }

  get parentLabelStyles() {
    return labelOffset(this.indent + 1);
  }

  get leafLabelStyles() {
    return labelOffset(this.indent + (this.args.icon ? 2 : 2.5));
  }

  select = (event: MouseEvent) => {
    if (this.args.disabled) return;
    event.stopPropagation();
    this.args.treeView.select(this, event);
  };

  setExpanded(expanded: boolean) {
    this.uncontrolledExpanded = expanded;
    this.args.onToggle?.(expanded, this);
  }

  toggle = (event: MouseEvent) => {
    event.stopPropagation();
    this.setExpanded(!this.expanded);
  };

  // Up, Down, Home and End move between nodes in TreeView's RovingFocus.
  handleKeydown = (hasChildren: boolean, event: KeyboardEvent) => {
    if (this.args.disabled) return;
    const node = event.currentTarget as HTMLElement;
    const { rovingFocus } = this.args.treeView;
    if (['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) {
      // Nodes nest, so the parent's handler would act on the same key.
      event.stopPropagation();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (hasChildren && this.expanded) {
        this.setExpanded(false);
      } else {
        const parent =
          node.parentElement?.closest<HTMLElement>('[role="treeitem"]');
        if (parent) rovingFocus.focus(parent);
      }
    } else if (event.key === 'ArrowRight' && hasChildren) {
      event.preventDefault();
      if (this.expanded) {
        const firstChild = rovingFocus.items.find(
          (item) => item !== node && node.contains(item),
        );
        if (firstChild) rovingFocus.focus(firstChild);
      } else {
        this.setExpanded(true);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (event.key === 'Enter' && hasChildren) {
        this.setExpanded(!this.expanded);
      }
      this.args.treeView.select(this, event);
    }
  };

  <template>
    <li
      role="treeitem"
      id={{this.nodeId}}
      aria-current={{if this.isActive "true"}}
      aria-selected={{unless @disabled (if this.isSelected "true" "false")}}
      aria-disabled={{if @disabled "true"}}
      aria-expanded={{if (has-block) (if this.expanded "true" "false")}}
      aria-owns={{if (has-block) (concat this.nodeId "__subtree")}}
      class="cds--tree-node
        {{if this.isSelected 'cds--tree-node--selected'}}
        {{if @disabled 'cds--tree-node--disabled'}}
        {{if this.isActive 'cds--tree-node--active'}}
        {{if @icon 'cds--tree-node--with-icon'}}
        {{if (has-block) 'cds--tree-parent-node' 'cds--tree-leaf-node'}}"
      {{on "click" this.select}}
      {{on "keydown" (fn this.handleKeydown (has-block))}}
      {{@treeView.rovingFocus.item disabled=@disabled hidden=@hidden}}
      ...attributes
    >
      <div
        class="cds--tree-node__label"
        {{style (if (has-block) this.parentLabelStyles this.leafLabelStyles)}}
      >
        {{#if (has-block)}}
          {{! eslint-disable-next-line ember/template-no-invalid-interactive }}
          <span
            class="cds--tree-parent-node__toggle"
            {{on "click" this.toggle}}
          >
            <svg
              class="cds--tree-parent-node__toggle-icon
                {{if
                  this.expanded
                  'cds--tree-parent-node__toggle-icon--expanded'
                }}"
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M24 12 16 22 8 12z"></path>
            </svg>
          </span>
        {{/if}}
        <span class="cds--tree-node__label__details">
          {{#if @icon}}
            <@icon @size="16" @svgClass="cds--tree-node__icon" />
          {{/if}}
          <span id="{{this.nodeId}}__label" class="cds--tree-node__label__text">
            {{@label}}
          </span>
        </span>
      </div>
      {{#if (has-block)}}
        <ul
          id="{{this.nodeId}}__subtree"
          role="group"
          aria-labelledby="{{this.nodeId}}__label"
          class="cds--tree-node__children
            {{unless this.expanded 'cds--tree-node--hidden'}}"
        >
          {{yield
            (component
              TreeNode
              treeView=@treeView
              depth=this.childDepth
              hidden=(or @hidden (not this.expanded))
              underIcon=this.childUnderIcon
              iconIndents=this.childIconIndents
            )
          }}
        </ul>
      {{/if}}
    </li>
  </template>
}

export interface TreeViewSignature {
  Element: HTMLUListElement;
  Args: {
    label: string;
    hideLabel?: boolean;
    multiselect?: boolean;
    selected?: Array<string>;
    active?: string;
    size?: 'xs' | 'sm';
    onSelect?: (selected: Array<string>, node: TreeNode) => void;
    onActivate?: (active: string) => void;
  };
  Blocks: {
    default: [TreeNode: WithBoundArgs<typeof TreeNode, 'treeView'>];
  };
}

export default class TreeView extends Component<TreeViewSignature> {
  @tracked selectedIds: Array<string> = [];
  @tracked activeId?: string;

  rovingFocus = new RovingFocus({ orientation: 'vertical' });

  get labelId() {
    return `tree-view-${guidFor(this)}__label`;
  }

  isSelected(id: string) {
    return this.selectedIds.includes(id) || !!this.args.selected?.includes(id);
  }

  isActive(id: string) {
    return this.activeId === id || this.args.active === id;
  }

  select = (node: TreeNode, event: Event) => {
    const id = node.nodeId;
    const isMultiselectClick =
      this.args.multiselect &&
      ((event as MouseEvent).metaKey || (event as MouseEvent).ctrlKey);
    if (isMultiselectClick) {
      this.selectedIds = this.isSelected(id)
        ? this.selectedIds.filter((selectedId) => selectedId !== id)
        : [...this.selectedIds, id];
    } else {
      this.selectedIds = [id];
    }
    this.activeId = id;
    this.args.onSelect?.(this.selectedIds, node);
    this.args.onActivate?.(id);
  };

  <template>
    {{#unless @hideLabel}}
      <label id={{this.labelId}} class="cds--label">{{@label}}</label>
    {{/unless}}
    <ul
      role="tree"
      aria-label={{if @hideLabel @label}}
      aria-labelledby={{unless @hideLabel this.labelId}}
      aria-multiselectable={{if @multiselect "true"}}
      class="cds--tree cds--tree--{{if @size @size 'sm'}}"
      {{this.rovingFocus.container}}
      ...attributes
    >
      {{yield (component TreeNode treeView=this depth=0)}}
    </ul>
  </template>
}
