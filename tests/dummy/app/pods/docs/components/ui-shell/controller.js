import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  menuItems = [{
    title: 'Home',
    routeName: 'index',
    icon: 'apps'
  }, {
    title: 'Menu With Submenu',
    icon: 'menu',
    submenus: [{
      title: 'A',
      routeName: 'submenu.a',
      icon: 'menu'
    }, {
      title: 'B',
      routeName: 'submenu.b',
      icon: 'menu'
    }]
  }];

  @action
  logout() {

  }

  @action
  transitionTo() {

  }
}
