import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import WorkspaceShell from './workspace-shell.gts';
import WorkspaceShellBody from './workspace-shell-body.gts';
import WorkspaceShellFooter from './workspace-shell-footer.gts';

import type {
  WorkspaceShellFooterSignature,
  WorkspaceShellFooterAction,
} from './workspace-shell-footer.gts';

// Mirrors `@carbon/ai-chat-components`' `workspace-shell-footer.stories.js`
// (`Components/Workspace shell/Footer`): `Default`, `ThreeButtons`,
// `WithDisabled` and `DangerActions`, each rendered inside a `WorkspaceShell`
// like upstream's decorator. Upstream's `cds-aichat-workspace-shell-footer-
// clicked` event is the `@onClick` callback here. Upstream's
// `carbonTheme`-style theming isn't ported: the Storybook toolbar's theme
// switcher applies Carbon's theme classes instead.
//
// Parity gaps (not faked):
// - Upstream renders `size="2xl"` buttons; this addon's `Button` tops out at
//   `xl` (see `WorkspaceShellFooter`'s class doc).

const payload = { test: 'value' };

const FOOTER_ACTION_LIST = {
  'Two buttons': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary', payload },
    { id: 'primary', label: 'Primary', kind: 'primary', payload },
  ],
  'Three buttons with one ghost': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary', payload },
    { id: 'primary', label: 'Primary', kind: 'primary', payload },
    { id: 'ghost', label: 'Ghost', kind: 'ghost', payload },
  ],
  'With disabled button': [
    {
      id: 'secondary',
      label: 'Secondary',
      kind: 'secondary',
      disabled: true,
      payload,
    },
    {
      id: 'primary',
      label: 'Primary',
      kind: 'primary',
      disabled: true,
      payload,
    },
  ],
  'Danger actions': [
    { id: 'secondary', label: 'Cancel', kind: 'secondary', payload },
    { id: 'danger', label: 'Delete', kind: 'danger', payload },
  ],
} satisfies Record<string, WorkspaceShellFooterAction[]>;

const BODY_TEXT =
  'This is sample content to demonstrate the footer positioning. The footer will be pushed to the bottom of the workspace shell. Shrink the workspace width below 671px to see the footer buttons stack vertically with primary actions appearing first.';

type ActionPreset = keyof typeof FOOTER_ACTION_LIST;
type StoryArgs = WorkspaceShellFooterSignature['Args'] & {
  actionPreset?: ActionPreset;
};

const actionsFor = (args: StoryArgs) =>
  args.actions ??
  (args.actionPreset ? FOOTER_ACTION_LIST[args.actionPreset] : undefined);

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Workspace shell/Footer',
  component: WorkspaceShellFooter,
  parameters: {
    docs: {
      description: {
        component:
          'The footer section of a `WorkspaceShell`: a row of action buttons that reorders (ghost/tertiary actions lead, primary trails) and stacks vertically once the shell narrows below 671px.',
      },
    },
  },
  argTypes: {
    actionPreset: {
      control: 'select',
      options: Object.keys(FOOTER_ACTION_LIST),
      description: 'Select a predefined set of actions',
    },
  },
  args: {
    onClick: fn(),
  },
  render: (args) => {
    const actions = actionsFor(args);

    return <template>
      <div style="display: flex; block-size: 30rem;">
        <WorkspaceShell style="flex: 1;">
          <:body>
            <WorkspaceShellBody>
              <p>{{BODY_TEXT}}</p>
            </WorkspaceShellBody>
          </:body>
          <:footer>
            <WorkspaceShellFooter
              @actions={{actions}}
              @onClick={{args.onClick}}
            />
          </:footer>
        </WorkspaceShell>
      </div>
    </template>;
  },
});

export const Default = meta.story({
  args: {
    actionPreset: 'Two buttons',
  },
});

Default.test(
  'reports the clicked action through onClick',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Primary' }));
    await expect(args.onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'primary', payload }),
    );
  },
);

export const ThreeButtons = meta.story({
  args: {
    actionPreset: 'Three buttons with one ghost',
  },
});

export const WithDisabled = meta.story({
  args: {
    actionPreset: 'With disabled button',
  },
});

WithDisabled.test(
  'does not report clicks on disabled actions',
  async ({ canvas, args }) => {
    await expect(
      canvas.getByRole('button', { name: 'Primary' }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'Secondary' }),
    ).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
);

export const DangerActions = meta.story({
  args: {
    actionPreset: 'Danger actions',
  },
});

DangerActions.test(
  'a danger action is styled as danger and reports through onClick',
  async ({ canvas, userEvent, args }) => {
    const remove = canvas.getByRole('button', { name: 'Delete' });
    await expect(remove).toHaveClass('cds--btn--danger');
    await userEvent.click(remove);
    await expect(args.onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'danger', kind: 'danger', payload }),
    );
  },
);

// docs-app's live demo: the footer on its own, showing the last action
// clicked.
export const Standalone = meta.story({
  args: {
    actions: [
      { label: 'Cancel', kind: 'ghost' },
      { label: 'Confirm', kind: 'primary' },
    ],
  },
  parameters: {
    controls: { exclude: ['actionPreset'] },
  },
  render: (args) => {
    const state = trackedObject({ last: '(none yet)' });
    const handleAction = (footerAction: WorkspaceShellFooterAction) => {
      state.last = footerAction.label;
      args.onClick?.(footerAction);
    };

    return <template>
      <div
        style="max-inline-size: 24rem; border: 1px solid var(--cds-border-subtle);"
      >
        <WorkspaceShellFooter
          @actions={{args.actions}}
          @onClick={{handleAction}}
        />
      </div>
      <p>last action: <output>{{state.last}}</output></p>
    </template>;
  },
});

Standalone.test(
  'shows the last action clicked',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onClick).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Cancel' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('Cancel');
  },
);
