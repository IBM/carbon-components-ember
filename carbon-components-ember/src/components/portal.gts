/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { service } from '@ember/service';
import type LayersService from '../services/layers.ts';

export interface PortalSignature {
  Args: {
    /**
     * Provide a DOM node to render the portal's content into. Defaults to
     * the topmost open `Modal`, so the content can be used over it, else
     * `document.body`. Without it, the content renders again whenever a
     * modal opens or closes; pass one to keep it in place.
     */
    container?: HTMLElement;
  };
  Blocks: {
    default: [];
  };
}

/**
 * Helper component for rendering content within a portal. By default, the
 * portal will render into the topmost open `Modal`, else `document.body`.
 * You can customize this behavior with the `@container` argument. Any content
 * yielded to this component will be rendered inside of the container.
 */
export default class Portal extends Component<PortalSignature> {
  @service('carbon.layers') declare layers: LayersService;

  get destination() {
    return this.args.container ?? this.layers.target;
  }

  // eslint-disable-next-line ember/template-require-splattributes -- renders its block elsewhere; no element of its own
  <template>
    {{#in-element this.destination insertBefore=null}}
      {{yield}}
    {{/in-element}}
  </template>
}
