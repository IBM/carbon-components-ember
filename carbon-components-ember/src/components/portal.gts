/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface PortalSignature {
  Args: {
    /**
     * Provide a DOM node to render the portal's content into. Defaults to
     * `document.body`.
     */
    container?: HTMLElement;
  };
  Blocks: {
    default: [];
  };
}

/**
 * Helper component for rendering content within a portal. By default, the
 * portal will render into `document.body`. You can customize this behavior
 * with the `@container` argument. Any content yielded to this component will
 * be rendered inside of the container.
 */
export default class Portal extends Component<PortalSignature> {
  get destination() {
    return this.args.container ?? document.body;
  }

  <template>
    {{#in-element this.destination}}
      {{yield}}
    {{/in-element}}
  </template>
}
