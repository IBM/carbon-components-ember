/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { modifier } from 'ember-modifier';
import type { ComponentLike } from '@glint/template';
import Button from '../button.gts';

export type WorkspaceShellFooterAction = {
  label: string;
  id?: string;
  kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  disabled?: boolean;
  payload?: unknown;
  icon?: ComponentLike<{ Args: { size?: number } }>;
};

export type Args = {
  actions?: WorkspaceShellFooterAction[];
  onClick?: (action: WorkspaceShellFooterAction) => void;
};

export interface WorkspaceShellFooterSignature {
  Element: HTMLDivElement;
  Args: Args;
}

const RANK: Record<string, number> = {
  ghost: 1,
  'danger--ghost': 2,
  tertiary: 3,
  danger: 5,
  primary: 6,
};

const watchStacked = modifier((element: HTMLElement, [onChange]: [(stacked: boolean) => void]) => {
  const observer = new ResizeObserver(() => {
    requestAnimationFrame(() => onChange(element.offsetWidth < 671));
  });
  observer.observe(element);
  return () => observer.disconnect();
});

/**
 * The footer section of a `WorkspaceShell`: a row of action buttons that
 * reorders (ghost/tertiary actions lead, primary trails) and stacks
 * vertically once the shell narrows below 671px, matching upstream's own
 * breakpoint.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-workspace-shell-footer`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/workspace-shell).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed. Upstream renders `size="2xl"` buttons via
 * `@carbon/web-components`; this addon's `Button` tops out at `'xl'`, so
 * that's what's used here instead - a real, documented gap, not a bug.
 */
export default class WorkspaceShellFooter extends Component<WorkspaceShellFooterSignature> {
  @tracked isStacked = false;

  get sortedActions() {
    const rank = (a: WorkspaceShellFooterAction) => RANK[a.kind ?? 'primary'] ?? 4;
    return [...(this.args.actions ?? [])].sort((a, b) => {
      const diff = rank(a) - rank(b);
      return this.isStacked ? -diff : diff;
    });
  }

  get isThreeButtons() {
    return (this.args.actions ?? []).length === 3;
  }

  @action
  setStacked(stacked: boolean) {
    this.isStacked = stacked;
  }

  @action
  handleClick(footerAction: WorkspaceShellFooterAction) {
    this.args.onClick?.(footerAction);
  }

  /**
   * Resolves `action.kind` to `Button`'s own `@type`/`@tertiary`/`@ghost`
   * args, exactly like `AiChatCardFooter`'s `buttonType`/`buttonTertiary`/
   * `buttonGhost` helpers: `@type` covers `'primary'`/`'secondary'`/
   * `'danger'`, `undefined` (with `@tertiary`/`@ghost` instead) covers
   * `'tertiary'`/`'ghost'`.
   */
  buttonType = (kind: WorkspaceShellFooterAction['kind']) => {
    const resolved = kind ?? 'primary';
    return resolved === 'tertiary' || resolved === 'ghost'
      ? undefined
      : resolved;
  };

  buttonTertiary = (kind: WorkspaceShellFooterAction['kind']) =>
    (kind ?? 'primary') === 'tertiary';

  buttonGhost = (kind: WorkspaceShellFooterAction['kind']) =>
    (kind ?? 'primary') === 'ghost';

  <template>
    <div
      data-rounded='bottom'
      data-stacked={{if this.isStacked ''}}
      class='cds-aichat-workspace-shell__footer {{if this.isThreeButtons "cds-aichat-workspace-shell__footer--three-buttons"}}'
      ...attributes
      {{watchStacked this.setStacked}}
    >
      {{#each this.sortedActions as |footerAction|}}
        <Button
          @type={{this.buttonType footerAction.kind}}
          @tertiary={{this.buttonTertiary footerAction.kind}}
          @ghost={{this.buttonGhost footerAction.kind}}
          @size='xl'
          @disabled={{footerAction.disabled}}
          @onClick={{fn this.handleClick footerAction}}
        >
          {{#if footerAction.icon}}<footerAction.icon @size={{16}} />{{/if}}
          {{footerAction.label}}
        </Button>
      {{/each}}
    </div>
  </template>
}
