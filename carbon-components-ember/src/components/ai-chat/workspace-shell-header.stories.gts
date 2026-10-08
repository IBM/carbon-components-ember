import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Tag from '../tag.gts';
import { Edit } from '../../icons.ts';
import WorkspaceShell from './workspace-shell.gts';
import WorkspaceShellBody from './workspace-shell-body.gts';
import WorkspaceShellHeader from './workspace-shell-header.gts';

import type { WorkspaceShellHeaderSignature } from './workspace-shell-header.gts';

// Mirrors `@carbon/ai-chat-components`' `workspace-shell-header.stories.js`
// (`Components/Workspace shell/Header`): `Default`, `WithDescription`,
// `WithTags`, `WithAction`, `Complete` and `Collapsible`, each rendered
// inside a `WorkspaceShell` with a short body like upstream's decorator.
// Upstream's `carbonTheme`-style theming isn't ported: the Storybook
// toolbar's theme switcher applies Carbon's theme classes instead.
//
// Parity gaps: none in the header itself. Upstream's "Edit Plan" action is a
// `cds-button kind="tertiary"`; this uses the addon's own `Button
// @tertiary`.

type DescriptionType = 'none' | 'basic' | 'withTags';

type StoryArgs = WorkspaceShellHeaderSignature['Args'] & {
  descriptionType: DescriptionType;
  showAction: boolean;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Workspace shell/Header',
  component: WorkspaceShellHeader,
  parameters: {
    docs: {
      description: {
        component: [
          'The header section of a `WorkspaceShell`: a title, an optional subtitle/description, and action content - optionally collapsible.',
          '',
          "Usually obtained via `WorkspaceShell`'s yielded `header` block param rather than imported directly - see `WorkspaceShell`'s docs.",
        ].join('\n'),
      },
    },
  },
  argTypes: {
    collapsible: {
      control: 'boolean',
      description:
        'Whether the header can be collapsed/expanded. When true, the header starts collapsed and can be toggled. When false, it is always fully expanded.',
    },
    descriptionType: {
      control: 'select',
      options: ['none', 'basic', 'withTags'],
      description: 'Type of description content to display',
    },
    showAction: {
      control: 'boolean',
      description: 'Whether to show the action button',
    },
  },
  args: {
    titleText: 'Workspace Title',
    subTitleText: 'Workspace subtitle',
    collapsible: false,
    descriptionType: 'none',
    showAction: false,
    onToggle: fn(),
  },
  render: (args: StoryArgs) => <template>
    <div style="display: flex; block-size: 30rem;">
      <WorkspaceShell style="flex: 1;">
        <:header>
          <WorkspaceShellHeader
            @titleText={{args.titleText}}
            @subTitleText={{args.subTitleText}}
            @collapsible={{args.collapsible}}
            @onToggle={{args.onToggle}}
          >
            <:headerDescription>
              {{#unless (eq args.descriptionType "none")}}
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                </div>
              {{/unless}}
              {{#if (eq args.descriptionType "withTags")}}
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
              {{#if args.showAction}}
                <Button @type={{undefined}} @tertiary={{true}}>
                  Edit Plan
                  <Edit @size="16" @svgClass="cds--btn__icon" />
                </Button>
              {{/if}}
            </:headerAction>
          </WorkspaceShellHeader>
        </:header>
        <:body>
          <WorkspaceShellBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco.
          </WorkspaceShellBody>
        </:body>
      </WorkspaceShell>
    </div>
  </template>,
});

export const Default = meta.story();

export const WithDescription = meta.story({
  args: {
    titleText: 'Project Analysis',
    subTitleText: 'Q4 2024 Performance Review',
    descriptionType: 'basic',
  },
});

export const WithTags = meta.story({
  args: {
    titleText: 'Development Plan',
    subTitleText: 'Sprint 23 - Feature Implementation',
    descriptionType: 'withTags',
  },
});

export const WithAction = meta.story({
  args: {
    titleText: 'Deployment Strategy',
    subTitleText: 'Production Release v2.5.0',
    descriptionType: 'basic',
    showAction: true,
  },
});

export const Complete = meta.story({
  args: {
    titleText: 'Complete Header Example',
    subTitleText: 'All features demonstrated',
    descriptionType: 'withTags',
    showAction: true,
  },
});

export const Collapsible = meta.story({
  args: {
    titleText: 'Collapsible Header',
    subTitleText: 'Click title to expand/collapse',
    collapsible: true,
    descriptionType: 'basic',
    showAction: true,
  },
});

Collapsible.test(
  'expands and collapses when the summary is clicked',
  async ({ canvasElement, userEvent, args }) => {
    const details = canvasElement.querySelector('details')!;
    const summary = details.querySelector('summary')!;
    await expect(details.open).toBe(false);

    await userEvent.click(summary);
    await waitFor(() => expect(args.onToggle).toHaveBeenLastCalledWith(true));
    await expect(details.open).toBe(true);

    await userEvent.click(summary);
    await waitFor(() => expect(args.onToggle).toHaveBeenLastCalledWith(false));
    await expect(details.open).toBe(false);
  },
);

// docs-app's live demo: a standalone collapsible header (outside a
// `WorkspaceShell`) with a plain-text description.
export const Standalone = meta.story({
  args: {
    titleText: 'Order #1234',
    subTitleText: 'Placed 2 days ago',
    collapsible: true,
  },
  parameters: {
    controls: {
      include: ['titleText', 'subTitleText', 'collapsible', 'onToggle'],
    },
  },
  render: (args) => <template>
    <div style="max-inline-size: 24rem;">
      <WorkspaceShellHeader
        @titleText={{args.titleText}}
        @subTitleText={{args.subTitleText}}
        @collapsible={{args.collapsible}}
        @onToggle={{args.onToggle}}
      >
        <:headerDescription>Additional detail about this order.</:headerDescription>
      </WorkspaceShellHeader>
    </div>
  </template>,
});
