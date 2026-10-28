/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import Grid from '../grid.gts';
import FullPageErrorIllustration from './-full-page-error-illustration.gts';
import './full-page-error.scss';

export interface FullPageErrorSignature {
  Element: HTMLDivElement;
  Args: {
    /** What went wrong, under the title. */
    description: string;
    /** Picks the illustration. Defaults to `custom`. */
    kind?: 'custom' | '403' | '404';
    /** The error, above the title, such as `Error 404`. */
    label: string;
    title: string;
  };
  Blocks: {
    /** Content under the description, such as links back into the app. */
    default: [];
  };
}

/**
 * A whole page telling people the page they asked for isn't available, as
 * Carbon for IBM Products' `FullPageError`: usually a wrong URL (`404`) or
 * missing permissions (`403`).
 */
const FullPageError: TOC<FullPageErrorSignature> = <template>
  <div class="c4p--full-page-error" ...attributes role="main">
    <div class="c4p--full-page-error__container">
      <Grid @mode="css-grid" class="c4p--full-page-error__grid" as |grid|>
        <grid.Column
          @sm={{4}}
          @md={{3}}
          @lg={{6}}
          class="c4p--full-page-error__column"
        >
          <h1 class="c4p--full-page-error__title">
            <span class="c4p--full-page-error__label">
              <span aria-hidden="true">↳ </span>
              {{@label}}
            </span>
            <span>{{@title}}</span>
          </h1>
          <p class="c4p--full-page-error__description">{{@description}}</p>
          <div class="c4p--full-page-error__body">{{yield}}</div>
        </grid.Column>
        <grid.Column @sm={{4}} @md={{5}} @lg={{10}}>
          <div class="c4p--full-page-error__svg-container">
            <FullPageErrorIllustration
              @kind={{@kind}}
              class="c4p--full-page-error__svg c4p--full-page-error__{{or
                  @kind
                  'custom'
                }}"
            />
          </div>
        </grid.Column>
      </Grid>
    </div>
  </div>
</template>;

export default FullPageError;
