import Component from '@ember/component';

export default Component.extend({
  searchResultsGlobal: null,
  searchResultsSection: null,
  menuItems: null,

  actions: {

    search(searchFor) {
      if (this.search) {
        return this.search(searchFor);
      }
      return null;
    },

    transitionTo(menuItem) {
      this.set('currentMenu', menuItem);
      this.transitionTo(menuItem);
    },

    toggleOpen() {
      this.toggleProperty('open');
      this.onToggle(this.open);
    }
  }
});
