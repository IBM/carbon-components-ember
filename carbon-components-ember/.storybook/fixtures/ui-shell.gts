import { htmlSafe } from '@ember/template';
import { RenderStory } from 'ember-storybook';

import Fade from '../../src/components/icons/fade.ts';

import type { MenuItem } from '../../src/components/ui-shell/-sidenav.gts';
import type { Decorator } from 'ember-storybook';

// Menus, frames and helpers the UI Shell story pages share.

export type StoryArgs = {
  title: string;
  subtitle: string;
  onAction: () => void;
};

export const SUB_LINKS = [
  { title: 'Link', icon: Fade },
  { title: 'Link', icon: Fade },
  { title: 'Link', icon: Fade },
];

export const MENU_ITEMS: MenuItem[] = [
  { title: 'Category title', icon: Fade, submenus: SUB_LINKS },
  { title: 'Category title', icon: Fade, submenus: SUB_LINKS },
  { title: 'Category title', icon: Fade, submenus: SUB_LINKS },
  { title: 'Link', icon: Fade, submenus: [] },
  { title: 'Link', icon: Fade, submenus: [] },
];

// The templates only render an icon when there is one; the cast is needed
// because MenuItem/SubMenu declare `icon` as required.
export const MENU_ITEMS_WITHOUT_ICONS = MENU_ITEMS.map((item) => ({
  ...item,
  icon: undefined,
  submenus: item.submenus.map((sub) => ({ ...sub, icon: undefined })),
})) as unknown as MenuItem[];

export const CURRENT = MENU_ITEMS[3]!;
export const CURRENT_WITHOUT_ICONS = MENU_ITEMS_WITHOUT_ICONS[3]!;
export const NO_ITEMS: MenuItem[] = [];
export const HOME: MenuItem = { title: 'Home', icon: Fade, submenus: [] };
export const noop = () => {};

// The shell's header and side nav are `position: fixed`; each story renders
// it inside a box whose `transform` makes it their containing block, so the
// shell stays inside the story instead of covering the page.
const frame = (height: string) =>
  htmlSafe(
    `position: relative; height: ${height}; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);`,
  );
export const FRAME = frame('26rem');
export const SMALL_FRAME = frame('14rem');

export const withShellFrame: Decorator = (Story, context) => <template>
  <div style={{FRAME}}>
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
</template>;
