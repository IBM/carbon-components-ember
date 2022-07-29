import Route from '@ember/routing/route';

class IndexRoute extends Route {
  redirect() {
    this.replaceWith('getting-started');
  }

}

export default IndexRoute;
