/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { fn, concat } from '@ember/helper';
import type { WithBoundArgs } from '@glint/template';
import { htmlSafe } from '@ember/template';

export interface TreeNodeArgs {
  treeView: TreeView;
  id?: string;
  label: string;
  disabled?: boolean;
  isExpanded?: boolean;
  /**
   * Nesting depth of this node within the tree, starting at 0 for
   * top-level nodes. Set automatically when nodes are yielded — do not
   * pass this manually.
   */
  depth?: number;
}

export interface TreeNodeSignature {
  Element: HTMLLIElement;
  Args: TreeNodeArgs;
  Blocks: {
    default: [WithBoundArgs<typeof TreeNode, 'treeView'>];
  };
}

class TreeNode extends Component<TreeNodeSignature> {
  @tracked expanded = this.args.isExpanded ?? false;

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

  // Mirrors upstream Carbon's per-node negative margin/padding trick so the
  // row's hover/selected background spans the full row width (flush with
  // the tree's left edge) instead of just starting where the label text
  // begins.
  get parentLabelStyle() {
    const offset = this.depth + 1;
    return htmlSafe(
      `margin-inline-start: -${offset}rem; padding-inline-start: ${offset}rem;`,
    );
  }

  get leafLabelStyle() {
    const offset = this.depth + 2.5;
    return htmlSafe(
      `margin-inline-start: -${offset}rem; padding-inline-start: ${offset}rem;`,
    );
  }

  @action
  select(event: MouseEvent) {
    if (this.args.disabled) return;
    event.stopPropagation();
    this.args.treeView.select(this, event);
  }

  @action
  toggle(event: MouseEvent) {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }

  @action
  handleKeydown(hasChildren: boolean, event: KeyboardEvent) {
    if (this.args.disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.args.treeView.select(this, event);
    } else if (hasChildren && event.key === 'ArrowRight' && !this.expanded) {
      event.preventDefault();
      this.expanded = true;
    } else if (hasChildren && event.key === 'ArrowLeft' && this.expanded) {
      event.preventDefault();
      this.expanded = false;
    }
  }

  <template>
    <li
      role='treeitem'
      id={{this.nodeId}}
      aria-current={{if this.isActive 'true'}}
      aria-selected={{unless @disabled (if this.isSelected 'true' 'false')}}
      aria-disabled={{if @disabled 'true'}}
      aria-expanded={{if (has-block) (if this.expanded 'true' 'false')}}
      aria-owns={{if (has-block) (concat this.nodeId '__subtree')}}
      tabindex={{unless @disabled '0'}}
      class='cds--tree-node
        {{if this.isSelected "cds--tree-node--selected"}}
        {{if @disabled "cds--tree-node--disabled"}}
        {{if this.isActive "cds--tree-node--active"}}
        {{if (has-block) "cds--tree-parent-node" "cds--tree-leaf-node"}}'
      {{on 'click' this.select}}
      {{on 'keydown' (fn this.handleKeydown (has-block))}}
      ...attributes
    >
      <div
        class='cds--tree-node__label'
        style={{if (has-block) this.parentLabelStyle this.leafLabelStyle}}
      >
        {{#if (has-block)}}
          {{! template-lint-disable no-invalid-interactive }}
          <span
            class='cds--tree-parent-node__toggle'
            {{on 'click' this.toggle}}
          >
            <svg
              class='cds--tree-parent-node__toggle-icon
                {{if this.expanded "cds--tree-parent-node__toggle-icon--expanded"}}'
              focusable='false'
              preserveAspectRatio='xMidYMid meet'
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 32 32'
              aria-hidden='true'
            >
              <path d='M24 12 16 22 8 12z'></path>
            </svg>
          </span>
        {{/if}}
        <span class='cds--tree-node__label__details'>
          <span id='{{this.nodeId}}__label' class='cds--tree-node__label__text'>
            {{@label}}
          </span>
        </span>
      </div>
      {{#if (has-block)}}
        <ul
          id='{{this.nodeId}}__subtree'
          role='group'
          aria-labelledby='{{this.nodeId}}__label'
          class='cds--tree-node__children
            {{unless this.expanded "cds--tree-node--hidden"}}'
        >
          {{yield (component TreeNode treeView=@treeView depth=this.childDepth)}}
        </ul>
      {{/if}}
    </li>
  </template>
}

export interface TreeViewArgs {
  label: string;
  hideLabel?: boolean;
  multiselect?: boolean;
  selected?: Array<string>;
  active?: string;
  size?: 'xs' | 'sm';
  onSelect?: (selected: Array<string>, node: TreeNode) => void;
  onActivate?: (active: string) => void;
}

export interface TreeViewSignature {
  Element: HTMLUListElement;
  Args: TreeViewArgs;
  Blocks: {
    default: [WithBoundArgs<typeof TreeNode, 'treeView'>];
  };
}

export default class TreeView extends Component<TreeViewSignature> {
  @tracked selectedIds: Array<string> = [];
  @tracked activeId?: string;

  get labelId() {
    return `tree-view-${guidFor(this)}__label`;
  }

  isSelected(id: string) {
    return this.selectedIds.includes(id) || !!this.args.selected?.includes(id);
  }

  isActive(id: string) {
    return this.activeId === id || this.args.active === id;
  }

  @action
  select(node: TreeNode, event: Event) {
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
  }

  <template>
    {{#unless @hideLabel}}
      <label id={{this.labelId}} class='cds--label'>{{@label}}</label>
    {{/unless}}
    <ul
      role='tree'
      aria-label={{if @hideLabel @label}}
      aria-labelledby={{unless @hideLabel this.labelId}}
      aria-multiselectable={{if @multiselect 'true'}}
      class='cds--tree cds--tree--{{if @size @size "sm"}}'
      ...attributes
    >
      {{yield (component TreeNode treeView=this depth=0)}}
    </ul>
  </template>
}
