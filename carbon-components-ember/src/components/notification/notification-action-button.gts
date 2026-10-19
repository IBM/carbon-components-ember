/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import Button from '../button.gts';
import type { ButtonSignature } from '../button.gts';

export interface NotificationActionButtonSignature {
  Element: ButtonSignature['Element'];
  Args: {
    /**
     * Specify if the visual treatment of the button should be for an inline
     * notification: a ghost button instead of a tertiary one.
     */
    inline?: boolean;
  };
  Blocks: {
    /** The button's label. */
    default: [];
  };
}

/**
 * The action button of `ActionableNotification` and `Callout`. Handle its
 * clicks with `{{on "click"}}`.
 */
const NotificationActionButton: TOC<NotificationActionButtonSignature> =
  <template>
    <Button
      @tertiary={{not @inline}}
      @ghost={{@inline}}
      @size="sm"
      class="cds--actionable-notification__action-button"
      ...attributes
    >
      {{yield}}
    </Button>
  </template>;

export default NotificationActionButton;
