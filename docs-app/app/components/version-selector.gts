import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import config from 'docs-app/config/environment';
import PowerSelect from 'ember-power-select/components/power-select';

export class VersionSelector extends Component {
  @tracked promise!: Promise<any>;
  @tracked selected = config.rootURL.split('/').slice(-2)[0] || 'main';

  async fetchVersions() {
    const result = await (
      await fetch(
        'https://api.github.com/repos/IBM/carbon-components-ember/contents/versions?ref=gh-pages'
      )
    ).json();

    return result.map((r: any) => r.name);
  }

  load = () => {
    this.promise = this.fetchVersions();
  };

  changeVersion = (ver: string) => {
    window.location.replace(config.rootURL.split('/').slice(0, -2).concat([ver]).join('/'));
  };

  <template>
    {{this.load}}
    <PowerSelect
      @renderInPlace={{true}}
      style="width: 200px"
      @options={{this.promise}}
      @selected={{this.selected}}
      @loadingMessage="loading versions"
      @onChange={{this.changeVersion}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
