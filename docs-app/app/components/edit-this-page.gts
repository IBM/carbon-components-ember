import Component from '@glimmer/component';
import { service } from '@ember/service';

import { docsManager } from 'kolay';

import type RouterService from '@ember/routing/router-service';
import type { ComponentLike } from '@glint/template';

/**
 * GitHub's edit URL for the directory kolay globs the docs' markdown out of.
 * A page's manifest `appRelativePath` is its location under that directory,
 * extension included (e.g. `/2-components/skeleton/icon.md`), so the two
 * concatenate into the source file's URL.
 */
const EDIT_ROOT = 'https://github.com/IBM/carbon-components-ember/edit/main/docs-app/app/templates';

export class EditThisPage extends Component<{
  Args: {
    /**
     * The `EditLink` component yielded by `PageLayout`'s `editLink` block.
     */
    link: ComponentLike<{ Args: { href: string }; Blocks: { default: [] } }>;
  };
}> {
  @service declare router: RouterService;

  /**
   * kolay's docs service keeps its selected-page state private, so the current
   * page is resolved the way that state does: `router.currentURL` is
   * app-relative (ember's location layer already stripped the rootURL), so
   * dropping any query params / hash leaves a path the manifest can be searched
   * by -- with or without the `.md` extension, since both are visitable.
   */
  get href() {
    const [path] = this.router.currentURL?.split(/[?#]/) ?? [];

    if (!path) return;

    const page = docsManager(this).findByPath(path);

    if (!page) return;

    return `${EDIT_ROOT}${page.appRelativePath}`;
  }

  <template>
    {{#if this.href}}
      <@link @href={{this.href}}>
        Edit this page
      </@link>
    {{/if}}
  </template>
}
