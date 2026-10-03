import { array, hash } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { eq } from 'ember-truth-helpers';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Notification from '../notification.gts';
import Tag from '../tag.gts';
import {
  Close,
  Download,
  Edit,
  Launch,
  Maximize,
  Share,
  Version,
} from '../../icons.ts';
import AiChatCodeSnippet from './code-snippet.gts';
import Toolbar from './toolbar.gts';
import WorkspaceShell from './workspace-shell.gts';
import WorkspaceShellBody from './workspace-shell-body.gts';
import WorkspaceShellFooter from './workspace-shell-footer.gts';

import type { ToolbarAction } from './toolbar.gts';
import type { Args as WorkspaceShellArgs } from './workspace-shell.gts';
import type { WorkspaceShellFooterAction } from './workspace-shell-footer.gts';

// Mirrors `@carbon/ai-chat-components`' `workspace-shell.stories.js`
// (`Components/Workspace shell` -> `Default`). Upstream's `carbonTheme`-style
// theming isn't ported: the Storybook toolbar's theme switcher applies
// Carbon's theme classes instead.
//
// Parity gaps (not faked):
// - Upstream's toolbar carries a `cds-ai-label` in its `decorator` slot; this
//   addon has no AILabel component, so the decorator block is left empty.
// - Upstream's notification is a `low-contrast`, `hide-close-button`
//   `cds-inline-notification`; this addon's `Notification` (`@display=
//   'inline'`) has neither option, so it renders high-contrast with its
//   (aria-hidden) close button.
// - The "long" body content uses `AiChatCodeSnippet` like upstream, with a
//   shortened version of upstream's TypeScript showcase snippet. Upstream's
//   `cds-table` (a full `@carbon/web-components` data table with toolbar
//   search) isn't reproduced here - the Ember port's `WorkspaceShellBody`
//   takes arbitrary content, so it has no bearing on the component itself.
// - Footer actions with `kind: 'danger'` go through this addon's `Button`
//   with `@type='danger'`, which opens Button's own confirm dialog before
//   `@onClick` fires (and needs a dialog mount point Storybook doesn't
//   provide). That's a component bug in `WorkspaceShellFooter` (same trap
//   `AiChatChatButton` already works around); the "Three buttons with one
//   danger" / "Danger actions" presets render, but clicking the danger
//   button doesn't report through `onFooterAction`.
// - `size="2xl"` footer buttons aren't available (`Button` tops out at
//   `xl`), see `WorkspaceShellFooter`'s class doc.

type ToolbarPreset = 'Advanced list' | 'Basic list' | 'Close only' | 'None';
type FooterPreset = keyof typeof FOOTER_ACTION_LIST;

const TOOLBAR_ACTION_LISTS: Record<ToolbarPreset, ToolbarAction[]> = {
  'Advanced list': [
    { text: 'Version', icon: Version, size: 'md' },
    { text: 'Download', icon: Download, size: 'md' },
    { text: 'Share', icon: Share, size: 'md' },
    { text: 'Launch', icon: Launch, size: 'md' },
    { text: 'Maximize', icon: Maximize, size: 'md' },
    { text: 'Close', fixed: true, icon: Close, size: 'md' },
  ],
  'Basic list': [
    { text: 'Launch', icon: Launch, size: 'md' },
    { text: 'Maximize', icon: Maximize, size: 'md' },
    { text: 'Close', fixed: true, icon: Close, size: 'md' },
  ],
  'Close only': [{ text: 'Close', fixed: true, icon: Close, size: 'md' }],
  None: [],
};

const payload = { test: 'value' };

const FOOTER_ACTION_LIST = {
  None: undefined,
  'One button': [{ id: 'primary', label: 'Primary', kind: 'primary', payload }],
  'A danger button': [
    { id: 'danger', label: 'Danger', kind: 'danger', payload },
  ],
  'A ghost button': [{ id: 'ghost', label: 'Ghost', kind: 'ghost', payload }],
  'Two buttons': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary', payload },
    { id: 'primary', label: 'Primary', kind: 'primary', payload },
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
  'Two buttons with one ghost': [
    { id: 'ghost', label: 'Ghost', kind: 'ghost', payload },
    { id: 'primary', label: 'Primary', kind: 'primary', payload },
  ],
  'Three buttons': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary', payload },
    { id: 'tertiary', label: 'Tertiary', kind: 'tertiary', payload },
    { id: 'primary', label: 'Primary', kind: 'primary', payload },
  ],
  'Three buttons with one ghost': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary', payload },
    { id: 'primary', label: 'Primary', kind: 'primary', payload },
    { id: 'ghost', label: 'Ghost', kind: 'ghost', payload },
  ],
  'Three buttons with one danger': [
    { id: 'ghost', label: 'Ghost', kind: 'ghost', payload },
    { id: 'secondary', label: 'Secondary', kind: 'secondary', payload },
    { id: 'danger', label: 'Danger', kind: 'danger', payload },
  ],
} satisfies Record<string, WorkspaceShellFooterAction[] | undefined>;

const MULTILINE_CODE = `/**
 * Carbon highlight showcase: control keywords, types, literals, doc comments, and more.
 */
import type { PaletteDefinition } from "./tokens";

type Nullable<T> = T | null | undefined;

interface TokenSwatch {
  readonly name: string;
  readonly hex: string;
  emphasis?: "strong" | "emphasis" | "strikethrough";
}

enum TokenGroup {
  Keyword = "keyword",
  Variable = "variable",
  String = "string",
}

export class TokenShowcase<T extends TokenSwatch> {
  static readonly version = "1.0.0";
  #cache = new Map<string, T>();

  constructor(private readonly theme: PaletteDefinition) {}

  resolve(name: string): Nullable<T> {
    return this.#cache.get(name) ?? null;
  }
}`;

const meta = preview
  .type<{
    args: WorkspaceShellArgs & {
      toolbarTitle: string;
      toolbarAction: ToolbarPreset;
      toolbarOverflow: boolean;
      notificationTitle: string;
      notificationSubTitle: string;
      headerTitle: string;
      headerSubTitle: string;
      headerDescription: 'basic' | 'withTags';
      showHeaderAction: boolean;
      bodyContent: 'short' | 'long';
      footerAction: FooterPreset;
      onToolbarAction: (text: string) => void;
      onFooterAction: (action: WorkspaceShellFooterAction) => void;
    };
  }>()
  .meta({
    title: 'AI Chat/Workspace shell',
    component: WorkspaceShell,
    parameters: {
      docs: {
        description: {
          component: [
            '`WorkspaceShell` is the outer AI Chat "workspace" surface: a vertical stack of an optional toolbar, notification area, header, scrollable body and footer. See also `WorkspaceShellHeader`, `WorkspaceShellBody` and `WorkspaceShellFooter`.',
            '',
            "The `header` block yields a `WorkspaceShellHeader` pre-bound with `@collapsible` - use it instead of importing `WorkspaceShellHeader` directly to get `@autoCollapsibleHeader`'s automatic behavior.",
          ].join('\n'),
        },
      },
    },
    argTypes: {
      toolbarTitle: {
        control: 'text',
        description: 'Title text for the Toolbar component',
      },
      toolbarAction: {
        control: 'select',
        options: Object.keys(TOOLBAR_ACTION_LISTS),
        description:
          'Select which predefined set of actions to render in the Toolbar component.',
      },
      toolbarOverflow: {
        control: 'boolean',
        description:
          'Overflow actions into an overflow menu when the toolbar is too narrow.',
      },
      notificationTitle: {
        control: 'text',
        description: 'Title text for the Notification component',
      },
      notificationSubTitle: {
        control: 'text',
        description: 'Subtitle text for the Notification component',
      },
      headerTitle: {
        control: 'text',
        description: 'Title text for the Header component',
      },
      headerSubTitle: {
        control: 'text',
        description: 'Subtitle text for the Header component',
      },
      headerDescription: {
        control: 'select',
        options: ['basic', 'withTags'],
        description: 'Defines the type of description text in the Header',
      },
      showHeaderAction: {
        control: 'boolean',
        description: 'Toggles whether header actions are shown',
      },
      bodyContent: {
        control: 'select',
        options: ['short', 'long'],
        description: 'Defines the content in the Body component',
      },
      footerAction: {
        control: 'select',
        options: Object.keys(FOOTER_ACTION_LIST),
        description: 'Defines the actions in the Footer component',
      },
    },
    args: {
      toolbarTitle: 'Title',
      toolbarAction: 'Advanced list',
      toolbarOverflow: true,
      notificationTitle: 'Title',
      notificationSubTitle: 'Message',
      headerTitle: 'Title',
      headerSubTitle: 'Sub title',
      headerDescription: 'withTags',
      showHeaderAction: true,
      autoCollapsibleHeader: false,
      bodyContent: 'short',
      footerAction: 'Three buttons with one ghost',
      onToolbarAction: fn(),
      onFooterAction: fn(),
    },
  });

export const Default = meta.story({
  // Known violation in a component this story composes (reported as a
  // warning until fixed): with `bodyContent: 'long'`, `AiChatCodeSnippet`'s
  // read-only container puts `aria-label` on a role-less div
  // (aria-prohibited-attr).
  parameters: {
    a11y: { test: 'todo' },
  },
  render: (args) => {
    const toolbarActions = TOOLBAR_ACTION_LISTS[args.toolbarAction].map(
      (action) => ({
        ...action,
        onClick: () => args.onToolbarAction(action.text),
      }),
    );
    const footerActions = FOOTER_ACTION_LIST[args.footerAction];

    return <template>
      <div style="display: flex; block-size: 40rem;">
        <WorkspaceShell
          @autoCollapsibleHeader={{args.autoCollapsibleHeader}}
          style="flex: 1;"
        >
          <:toolbar>
            <Toolbar
              @titleText={{args.toolbarTitle}}
              @overflow={{args.toolbarOverflow}}
              @actions={{toolbarActions}}
            />
          </:toolbar>
          <:notification>
            <Notification
              @display="inline"
              @kind="warning"
              @title={{args.notificationTitle}}
              @text={{args.notificationSubTitle}}
            />
          </:notification>
          <:header as |Header|>
            <Header
              @titleText={{args.headerTitle}}
              @subTitleText={{args.headerSubTitle}}
            >
              <:headerDescription>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                </div>
                {{#if (eq args.headerDescription "withTags")}}
                  <div style="display: flex; gap: 4px;">
                    <Tag @size="sm" @type="gray">Tag</Tag>
                    <Tag @size="sm" @type="gray">Tag</Tag>
                    <Tag @size="sm" @type="gray">Tag</Tag>
                    <Tag @size="sm" @type="gray">Tag</Tag>
                    <Tag @size="sm" @type="gray">Tag</Tag>
                  </div>
                {{/if}}
              </:headerDescription>
              <:headerAction>
                {{#if args.showHeaderAction}}
                  <Button @type={{undefined}} @tertiary={{true}}>
                    Edit Plan
                    <Edit @size="16" @svgClass="cds--btn__icon" />
                  </Button>
                {{/if}}
              </:headerAction>
            </Header>
          </:header>
          <:body>
            <WorkspaceShellBody>
              {{#if (eq args.bodyContent "long")}}
                <div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Curabitur et velit sed erat faucibus blandit non nec felis.
                    Nulla facilisi. Pellentesque nec finibus lectus. Vestibulum
                    vitae sem eget lacus aliquam congue vitae ut elit.
                  </p>
                  <br />
                  <AiChatCodeSnippet
                    @code={{MULTILINE_CODE}}
                    @language="typescript"
                    @highlight={{true}}
                  />
                  <br />
                  <p>
                    Fusce egestas sapien id sem luctus, nec hendrerit velit
                    elementum. In in justo a nunc accumsan vestibulum. Quisque
                    ut interdum est. Proin id felis ac justo blandit dictum.
                    Suspendisse in tellus a risus fermentum volutpat vel quis
                    leo. Curabitur varius, libero at pulvinar suscipit, urna
                    nisi volutpat felis, sed maximus diam eros non metus.
                  </p>
                </div>
              {{else}}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco.
              {{/if}}
            </WorkspaceShellBody>
          </:body>
          <:footer>
            {{#if footerActions}}
              <WorkspaceShellFooter
                @actions={{footerActions}}
                @onClick={{args.onFooterAction}}
              />
            {{/if}}
          </:footer>
        </WorkspaceShell>
      </div>
    </template>;
  },
});

Default.test(
  'reports footer clicks through onFooterAction',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Primary' }));
    await expect(args.onFooterAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'primary', label: 'Primary' }),
    );
  },
);

export const AutoCollapsibleHeader = Default.extend({
  args: {
    autoCollapsibleHeader: true,
    bodyContent: 'long',
  },
  parameters: {
    docs: {
      description: {
        story:
          "With `@autoCollapsibleHeader`, the header yielded to the `header` block collapses into a `<details>` whenever the body would otherwise have less room than the header itself. Upstream's `autoCollapsibleHeader` control on its `Default` story, shown as its own variant here.",
      },
    },
  },
});

// docs-app's live demo: a compact "order details" workspace that reports the
// last footer action clicked.
// It ignores the upstream-parity controls above.
export const OrderDetails = meta.story({
  parameters: {
    controls: { include: ['onFooterAction'] },
  },
  render: (args) => {
    const state = trackedObject({ last: '(none yet)' });
    const handleAction = (footerAction: WorkspaceShellFooterAction) => {
      state.last = footerAction.label;
      args.onFooterAction(footerAction);
    };

    return <template>
      <div style="max-inline-size: 24rem; block-size: 20rem;">
        <WorkspaceShell>
          <:toolbar>
            <Toolbar @titleText="Order details" />
          </:toolbar>
          <:header as |Header|>
            <Header
              @titleText="Order #1234"
              @subTitleText="Placed 2 days ago"
            />
          </:header>
          <:body>
            <WorkspaceShellBody>
              <p>Workspace body content goes here.</p>
            </WorkspaceShellBody>
          </:body>
          <:footer>
            <WorkspaceShellFooter
              @actions={{array
                (hash label="Cancel" kind="ghost")
                (hash label="Confirm" kind="primary")
              }}
              @onClick={{handleAction}}
            />
          </:footer>
        </WorkspaceShell>
      </div>
      <p>last footer action: <output>{{state.last}}</output></p>
    </template>;
  },
});

OrderDetails.test(
  'shows the last footer action clicked',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm' }));
    await expect(args.onFooterAction).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Confirm' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('Confirm');
  },
);
