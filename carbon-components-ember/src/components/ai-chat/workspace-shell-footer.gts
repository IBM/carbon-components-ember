/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import type { IconComponent } from '../icon.gts';
import Button from '../button.gts';
import './workspace-shell.scss';
import { observeResize } from '../../utils/resize-observer.ts';

export type WorkspaceShellFooterAction = {
  label: string;
  id?: string;
  kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  disabled?: boolean;
  payload?: unknown;
  icon?: IconComponent;
};

export interface WorkspaceShellFooterSignature {
  Element: HTMLDivElement;
  Args: {
    actions?: WorkspaceShellFooterAction[];
    onClick?: (action: WorkspaceShellFooterAction) => void;
  };
}

const RANK: Record<string, number> = {
  ghost: 1,
  tertiary: 3,
  danger: 5,
  primary: 6,
};

const watchStacked = modifier(
  (element: HTMLElement, [onChange]: [(stacked: boolean) => void]) => {
    return observeResize(element, () => onChange(element.offsetWidth < 671));
  },
);

/**
 * The footer section of a `WorkspaceShell`: a row of action buttons that
 * reorders (ghost/tertiary actions lead, primary trails) and stacks
 * vertically once the shell narrows below 671px, matching upstream's own
 * breakpoint.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-workspace-shell-footer`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/workspace-shell).
 * Upstream renders `size="2xl"` buttons via
 * `@carbon/web-components`; this addon's `Button` tops out at `'xl'`, so
 * that's what's used here instead - a real, documented gap, not a bug.
 *
 * Upstream's `kind` also accepts `danger--tertiary`/`danger--ghost`
 * combination kinds (from `@carbon/web-components`' `BUTTON_KIND`), same gap
 * as `ChatButton` - `WorkspaceShellFooterAction['kind']` doesn't
 * accept them, so they're not reproduced here either.
 */
export default class WorkspaceShellFooter extends Component<WorkspaceShellFooterSignature> {
  @tracked isStacked = false;

  get sortedActions() {
    const rank = (a: WorkspaceShellFooterAction) =>
      RANK[a.kind ?? 'primary'] ?? 4;
    return [...(this.args.actions ?? [])].sort((a, b) => {
      const diff = rank(a) - rank(b);
      return this.isStacked ? -diff : diff;
    });
  }

  get isThreeButtons() {
    return (this.args.actions ?? []).length === 3;
  }

  setStacked = (stacked: boolean) => {
    this.isStacked = stacked;
  };

  handleClick = (footerAction: WorkspaceShellFooterAction) => {
    this.args.onClick?.(footerAction);
  };

  <template>
    <div
      data-rounded="bottom"
      data-stacked={{if this.isStacked ""}}
      class="cds-aichat-workspace-shell__footer
        {{if
          this.isThreeButtons
          'cds-aichat-workspace-shell__footer--three-buttons'
        }}"
      ...attributes
      {{watchStacked this.setStacked}}
    >
      {{#each this.sortedActions as |footerAction|}}
        <Button
          @kind={{footerAction.kind}}
          @size="xl"
          @disabled={{footerAction.disabled}}
          {{on "click" (fn this.handleClick footerAction)}}
        >
          {{#if footerAction.icon}}<footerAction.icon @size={{16}} />{{/if}}
          {{footerAction.label}}
        </Button>
      {{/each}}
    </div>
  </template>
}
