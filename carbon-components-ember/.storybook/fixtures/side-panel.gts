import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { RenderStory } from 'ember-storybook';

import Button from '../../src/components/button.gts';
import DataTable from '../../src/components/data-table.gts';
import MultiSelect from '../../src/components/multi-select.gts';
import TextArea from '../../src/components/text-area.gts';
import TextInput from '../../src/components/text-input.gts';
import UIShell from '../../src/components/ui-shell.gts';
import Copy from '../../src/components/icons/copy.ts';
import Settings from '../../src/components/icons/settings.ts';
import TrashCan from '../../src/components/icons/trash-can.ts';

import type {
  SidePanelAction,
  SidePanelToolbarButton,
} from '../../src/components/side-panel.gts';
import type { TOC } from '@ember/component/template-only';
import type { Decorator } from 'ember-storybook';
import '#storybook/styles/side-panel.css';

// Carbon React's SidePanel stories share one body, a toolbar and the page the
// panel sits over.

export const TOOLBAR_BUTTONS: SidePanelToolbarButton[] = [
  { label: 'Copy', leading: true, renderIcon: Copy, kind: 'primary' },
  { label: 'Settings', renderIcon: Settings, hasIconOnly: true },
  { label: 'Delete', renderIcon: TrashCan, hasIconOnly: true },
];

// The story's actions plus a handler, so the Actions panel logs them.
export function withHandlers(
  actions: SidePanelAction[] | undefined,
  onAction: (label: string) => void,
): SidePanelAction[] {
  return (actions ?? []).map((action) => ({
    ...action,
    onClick: () => onAction(action.label),
  }));
}

export function toolbarWithHandlers(
  onAction: (label: string) => void,
): SidePanelToolbarButton[] {
  return TOOLBAR_BUTTONS.map((button) => ({
    ...button,
    onClick: () => onAction(button.label),
  }));
}

// Keeps the element a panel returns focus to.
export const captureLauncher = modifier(
  (element: HTMLElement, [state]: [{ launcher: HTMLElement | null }]) => {
    state.launcher = element;
  },
);

// A panel that starts open, as Carbon React's stories do, and the button
// that opens and closes it.
export function panelState(
  onRequestClose?: (event: Event) => void,
  open = true,
) {
  const state = trackedObject<{
    open: boolean;
    step: number;
    launcher: HTMLElement | null;
  }>({ open, step: 0, launcher: null });
  return {
    state,
    toggle: () => {
      state.open = !state.open;
    },
    close: (event: Event) => {
      state.open = false;
      onRequestClose?.(event);
    },
    next: () => {
      state.step += 1;
    },
    back: () => {
      state.step -= 1;
    },
  };
}

const HEADERS = [{ label: 'Column header' }, { label: 'Column header' }];
const ROWS = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({
  id,
  value: `Cell text ${id}`,
}));

export const Table: TOC<object> = <template>
  <DataTable @title="Table" @items={{ROWS}} as |table|>
    <table.Table>
      <table.Header @headers={{HEADERS}} />
      <table.EachBodyRows as |row|>
        <row.Row>
          <table.Column>{{row.item.value}}</table.Column>
          <table.Column>{{row.item.value}}</table.Column>
        </row.Row>
      </table.EachBodyRows>
    </table.Table>
  </DataTable>
</template>;

const ITEMS = [{ id: 'all', text: 'Multiselect A' }];
const itemText = (item: { text: string }) => item.text;

export const Body: TOC<object> = <template>
  <div class="side-panel-story__body-content">
    <h3 class="side-panel-story__body-subheading">Section</h3>
    <div class="side-panel-story__text-inputs">
      <TextInput @labelText="Input A" @id="side-panel-story-text-input-a" />
      <TextInput @labelText="Input B" @id="side-panel-story-text-input-b" />
    </div>
    <div class="side-panel-story__text-inputs">
      <TextInput @labelText="Input C" @id="side-panel-story-text-input-c" />
      <TextInput @labelText="Input D" @id="side-panel-story-text-input-d" />
    </div>
    <div class="side-panel-story__multi-select-container">
      <MultiSelect
        @titleText="Multiselect A"
        @label="Select an item"
        @items={{ITEMS}}
        @itemToString={{itemText}}
        @selectionFeedback="top-after-reopen"
      />
    </div>
    <TextArea @labelText="Notes" class="side-panel-story__text-area" />
    <h3
      class="side-panel-story__content-subtitle side-panel-story__body-subheading"
    >Section</h3>
    <Table />
  </div>
</template>;

export const Step: TOC<{
  Args: { step: number; onNext: () => void };
}> = <template>
  <div class="side-panel-story__body-content">
    {{#if @step}}
      <h3
        class="side-panel-story__content-subtitle side-panel-story__body-subheading"
      >Detail view</h3>
      <Table />
    {{else}}
      <h3
        class="side-panel-story__content-subtitle side-panel-story__body-subheading"
      >Main view</h3>
      <Table />
      <Button @kind="tertiary" {{on "click" @onNext}}>View all</Button>
    {{/if}}
  </div>
</template>;

// The page under the header, in a box that contains the panel's
// `position: fixed`, so it stays inside the story.
export const withPageFrame: Decorator = (Story, context) => <template>
  <div class="side-panel-story__viewport">
    <UIShell>
      <:shell as |s|>
        <s.Header @href="#" @title="IBM" @subtitle="Cloud Pak" />
      </:shell>
      <:content></:content>
    </UIShell>
    <div class="side-panel-story__story-content">
      <RenderStory @story={{Story}} @args={{context.args}} />
    </div>
  </div>
</template>;
