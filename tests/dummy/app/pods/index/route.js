import Route from '@ember/routing/route';

class IndexRoute extends Route {
  redirect() {
    this.replaceWith('docs.getting-started.installation');
  }

}

export default IndexRoute;
