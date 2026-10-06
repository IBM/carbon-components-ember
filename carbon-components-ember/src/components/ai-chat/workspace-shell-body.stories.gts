import preview from '#storybook/preview.ts';
import WorkspaceShell from './workspace-shell.gts';
import WorkspaceShellBody from './workspace-shell-body.gts';

// Mirrors `@carbon/ai-chat-components`' `workspace-shell-body.stories.js`
// (`Components/Workspace shell/Body`): `Default`, `LongContent`,
// `WithCustomContent` and `EmptyState`, each rendered inside a
// `WorkspaceShell` like upstream's decorator. Upstream's `carbonTheme`-style
// theming isn't ported: the Storybook toolbar's theme switcher applies
// Carbon's theme classes instead.
//
// Parity gaps: upstream's "long" content embeds a `cds-aichat-code-snippet`
// and a `cds-table`; that's just sample content for a scrollable container,
// so `LongContent` uses plain long text instead (see the `Workspace shell`
// stories for the code snippet). `WorkspaceShellBody` itself has no args.

const SHORT_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.';

const LONG_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et velit sed erat faucibus blandit non nec felis. Nulla facilisi. Pellentesque nec finibus lectus. Vestibulum vitae sem eget lacus aliquam congue vitae ut elit.',
  'Fusce egestas sapien id sem luctus, nec hendrerit velit elementum. In in justo a nunc accumsan vestibulum. Quisque ut interdum est. Proin id felis ac justo blandit dictum. Suspendisse in tellus a risus fermentum volutpat vel quis leo.',
  'Curabitur varius, libero at pulvinar suscipit, urna nisi volutpat felis, sed maximus diam eros non metus. Integer vitae tortor id justo tempor elementum. Morbi pretium, ipsum ut mattis elementum, augue mi aliquet nisl, a facilisis magna justo eu lorem.',
  'Aliquam erat volutpat. Sed a eros sit amet nibh placerat tristique. Donec in erat ac sem facilisis aliquet. Etiam vitae turpis id lorem porta faucibus. Nam ultricies, risus et iaculis condimentum, augue nibh tempus nunc, eu ultricies justo nibh eget lacus.',
  'Vivamus gravida, nisl at feugiat interdum, mauris ipsum sagittis velit, quis finibus nibh nisl vel nisi. Phasellus scelerisque urna a ex hendrerit, non imperdiet ligula pulvinar. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  'Suspendisse potenti. Cras faucibus, mauris ut vestibulum tincidunt, purus erat mattis turpis, eu varius mi velit sit amet nibh. Ut consequat sapien vitae libero maximus, sed aliquet nisl dapibus. Donec euismod efficitur mauris, nec congue lectus fringilla ut.',
];

const meta = preview.meta({
  title: 'AI Chat/Workspace shell/Body',
  component: WorkspaceShellBody,
  parameters: {
    docs: {
      description: {
        component:
          'The main, scrollable content area of a `WorkspaceShell`. The content automatically scrolls if it exceeds the available height.',
      },
    },
  },
});

export const Default = meta.story({
  render: () => <template>
    <div style="display: flex; block-size: 30rem;">
      <WorkspaceShell style="flex: 1;">
        <:body>
          <WorkspaceShellBody>{{SHORT_TEXT}}</WorkspaceShellBody>
        </:body>
      </WorkspaceShell>
    </div>
  </template>,
});

export const LongContent = meta.story({
  render: () => <template>
    <div style="display: flex; block-size: 30rem;">
      <WorkspaceShell style="flex: 1;">
        <:body>
          <WorkspaceShellBody>
            {{#each LONG_PARAGRAPHS as |paragraph|}}
              <p style="margin-block-end: 1rem;">{{paragraph}}</p>
            {{/each}}
          </WorkspaceShellBody>
        </:body>
      </WorkspaceShell>
    </div>
  </template>,
});

export const WithCustomContent = meta.story({
  render: () => <template>
    <div style="display: flex; block-size: 30rem;">
      <WorkspaceShell style="flex: 1;">
        <:body>
          <WorkspaceShellBody>
            <div>
              <h3 style="margin-bottom: 1rem;">Custom Content Example</h3>
              <p style="margin-bottom: 1rem;">
                This body can contain any custom HTML or components. The content
                will automatically scroll if it exceeds the available height.
              </p>
              <div
                style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;"
              >
                <div
                  style="padding: 1rem; background: var(--cds-layer-01); border-radius: 4px;"
                >
                  <h4 style="margin-bottom: 0.5rem;">Card 1</h4>
                  <p>Custom card content</p>
                </div>
                <div
                  style="padding: 1rem; background: var(--cds-layer-01); border-radius: 4px;"
                >
                  <h4 style="margin-bottom: 0.5rem;">Card 2</h4>
                  <p>Custom card content</p>
                </div>
                <div
                  style="padding: 1rem; background: var(--cds-layer-01); border-radius: 4px;"
                >
                  <h4 style="margin-bottom: 0.5rem;">Card 3</h4>
                  <p>Custom card content</p>
                </div>
              </div>
            </div>
          </WorkspaceShellBody>
        </:body>
      </WorkspaceShell>
    </div>
  </template>,
});

export const EmptyState = meta.story({
  render: () => <template>
    <div style="display: flex; block-size: 30rem;">
      <WorkspaceShell style="flex: 1;">
        <:body>
          <WorkspaceShellBody>
            <div
              style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;"
            >
              <h3 style="margin-bottom: 1rem;">No content available</h3>
              <p style="color: var(--cds-text-secondary);">
                This workspace is empty. Add content to get started.
              </p>
            </div>
          </WorkspaceShellBody>
        </:body>
      </WorkspaceShell>
    </div>
  </template>,
});

// docs-app's live demo: the body on its own, outside a `WorkspaceShell`.
export const Standalone = meta.story({
  render: () => <template>
    <div
      style="max-inline-size: 24rem; border: 1px solid var(--cds-border-subtle);"
    >
      <WorkspaceShellBody>
        <p>Workspace body content goes here.</p>
      </WorkspaceShellBody>
    </div>
  </template>,
});
