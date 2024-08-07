// BEGIN-SNIPPET ui-shell.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class UiShellController extends Controller {
  @tracked leftSideBarOpen = true;
  @tracked currentMenu = null;

  menuItems = [
    {
      title: 'Home',
      routeName: 'index',
      icon: 'apps',
    },
    {
      title: 'Menu With Submenu',
      icon: 'menu',
      submenus: [
        {
          title: 'A',
          routeName: 'submenu.a',
          icon: 'menu',
        },
        {
          title: 'B',
          routeName: 'submenu.b',
          icon: 'menu',
        },
      ],
    },
  ];

  @action
  logout() {}

  @action
  transitionTo(menu) {
    this.currentMenu = menu;
  }
}
// END-SNIPPET
