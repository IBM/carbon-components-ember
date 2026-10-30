import { fn as spy } from 'storybook/test';

import Button from '../../src/components/button.gts';
import BreadcrumbItem from '../../src/components/breadcrumb/breadcrumb-item.gts';
import Add from '../../src/components/icons/add.ts';
import Activity from '../../src/components/icons/activity.ts';
import AiGenerate from '../../src/components/icons/ai-generate.ts';
import Bee from '../../src/components/icons/bee.ts';
import CloudFoundry1 from '../../src/components/icons/cloud-foundry_1.ts';
import Tabs from '../../src/components/tabs.gts';
import Tag from '../../src/components/tag.gts';

import type { PageHeaderBreadcrumbPageActionItem } from '../../src/components/ibm-products/page-header-breadcrumb-page-actions.gts';
import type { PageHeaderContentPageAction } from '../../src/components/ibm-products/page-header-content-page-actions.gts';
import type { ButtonSignature } from '../../src/components/button.gts';
import type { TOC } from '@ember/component/template-only';

// What Carbon for IBM Products' PageHeader stories share.

export const LONG_TITLE =
  'Virtual-Machine-DAL-really-long-title-example-that-goes-at-least-2-lines-long';

export const BODY_TEXT =
  'Built for modern teams, our technology platform simplifies complexity with powerful APIs, real-time collaboration tools, and seamless integration. From deployment to monitoring, we help you ship faster, scale efficiently, and stay in control every step of the way.';

export interface PageHeaderStoryArgs {
  title: string;
  border: boolean;
  pageActionsFlush: boolean;
  contentActionsFlush: boolean;
  /** Story control: shows the icon in the breadcrumb bar. */
  renderBreadcrumbIcon: boolean;
  fullWidthGrid: boolean | 'xl';
  narrowGrid: boolean;
}

export const PAGE_HEADER_ARGS = {
  border: true,
  pageActionsFlush: false,
  contentActionsFlush: false,
  title: LONG_TITLE,
  renderBreadcrumbIcon: true,
  fullWidthGrid: false,
  narrowGrid: false,
};

export const PAGE_HEADER_ARG_TYPES = {
  border: { description: 'Specify whether to render BreadcrumbBar border' },
  pageActionsFlush: {
    description:
      'Specify whether the page actions within BreadcrumbBar should be flush',
  },
  contentActionsFlush: {
    description:
      'Specify whether the content actions within BreadcrumbBar should be flush with the page actions',
  },
  title: {
    description:
      'Provide the title text to be rendered within PageHeaderContent',
    control: 'text',
  },
  renderBreadcrumbIcon: {
    description:
      'Specify whether to render the BreadcrumbBar icon (storybook control only)',
    table: { category: 'story controls' },
  },
  fullWidthGrid: {
    description:
      'Apply Carbon full-width grid mode to all sub-component grids. Pass `true` for full width or `"xl"` for full width with xl padding override.',
    control: 'select',
    options: [false, true, 'xl'],
  },
  narrowGrid: {
    description: 'Apply Carbon narrow grid mode to all sub-component grids.',
  },
} as const;

export const BeeIcon: TOC<object> = <template><Bee @size={{32}} /></template>;

export const BreadcrumbBeeIcon: TOC<object> = <template>
  <Bee @size={{16}} />
</template>;

/** The breadcrumb that holds the ones that don't fit, in an overflow menu. */
export const OverflowBreadcrumb: TOC<{
  Element: HTMLLIElement;
  Args: { hiddenBreadcrumbs: HTMLElement[] };
}> = <template>
  <BreadcrumbItem data-floating-menu-container="true" ...attributes as |item|>
    <item.OverflowMenu
      @align="bottom"
      @ariaLabel="Overflow menu in a breadcrumb"
      as |OverflowMenuItem|
    >
      {{#each @hiddenBreadcrumbs as |element|}}
        <OverflowMenuItem @itemText={{element.innerText}} />
      {{/each}}
    </item.OverflowMenu>
  </BreadcrumbItem>
</template>;

const iconAction = (icon: ButtonSignature['Args']['renderIcon'], n: number) =>
  <template>
    <Button
      @renderIcon={{icon}}
      @iconDescription="Icon Description {{n}}"
      @hasIconOnly={{true}}
      @size="md"
      @kind="ghost"
      ...attributes
    />
  </template> as TOC<{ Element: ButtonSignature['Element'] }>;

const PrimaryAction: TOC<{ Element: ButtonSignature['Element'] }> = <template>
  <Button
    @kind="primary"
    @renderIcon={{Add}}
    @size="md"
    aria-label="Add Primary action"
    ...attributes
  >Primary action</Button>
</template>;

export const pageActionButtonItems = (
  onClick: () => void = spy(),
): PageHeaderContentPageAction[] => [
  ...[
    [AiGenerate, 'action1'],
    [Activity, 'action2'],
    [Activity, 'action3'],
    [Activity, 'action4'],
  ].map(([icon, id], index) => ({
    id: id as string,
    onClick,
    body: iconAction(icon as ButtonSignature['Args']['renderIcon'], index + 1),
    menuItem: { label: `action ${index + 1}` },
  })),
  {
    id: 'primary-action',
    onClick,
    body: PrimaryAction,
    menuItem: { label: 'Add Primary action' },
  },
];

export const breadcrumbPageActionItems = (
  onClick: () => void = spy(),
): PageHeaderBreadcrumbPageActionItem[] => [
  {
    id: 'breadcrumb-action-1',
    label: 'Icon Description 1',
    renderIcon: Activity,
    onClick,
  },
  {
    id: 'breadcrumb-action-2',
    label: 'Icon Description 2',
    renderIcon: AiGenerate,
    onClick,
  },
  {
    id: 'breadcrumb-action-3',
    label: 'Icon Description 3',
    renderIcon: CloudFoundry1,
    onClick,
  },
];

/** Seven tabs; the page's content is below, in `StoryTallPanel`. */
export const StoryTabs: TOC<{ Element: HTMLDivElement }> = <template>
  <Tabs as |TabList TabPanels|>
    <TabList aria-label="List of tabs" ...attributes as |Tab|>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
      <Tab>Tab 4</Tab>
      <Tab>Tab 5</Tab>
      <Tab>Tab 6</Tab>
      <Tab>Tab 7</Tab>
    </TabList>
    <TabPanels as |TabPanel|>
      <TabPanel />
      <TabPanel />
      <TabPanel />
      <TabPanel />
      <TabPanel />
      <TabPanel />
      <TabPanel />
    </TabPanels>
  </Tabs>
</template>;

/** Content tall enough for the page to scroll. */
export const StoryTallPanel: TOC<{ Element: HTMLDivElement }> = <template>
  <div class="ibm-products-page-header-story__tall-panel" ...attributes>
    Tab Panel 1
  </div>
</template>;

export const TAB_BAR_TAGS = [
  { id: 'example-tag-1', type: 'blue' as const, text: 'Tag 1' },
  { id: 'example-tag-2', type: 'purple' as const, text: 'Tag 2' },
  { id: 'example-tag-3', type: 'red' as const, text: 'Tag 3' },
  { id: 'example-tag-4', type: 'blue' as const, text: 'Tag 4' },
  { id: 'example-tag-5', type: 'purple' as const, text: 'Tag 5' },
  { id: 'example-tag-6', type: 'red' as const, text: 'Tag 6' },
];

/** The tag with this element's `id`, to show again in the popover. */
export const tagFor = (element: HTMLElement) =>
  TAB_BAR_TAGS.find((tag) => tag.id === element.id);

export { Tag };
