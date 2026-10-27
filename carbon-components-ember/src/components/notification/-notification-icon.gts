/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import CheckmarkFilled from '../icons/checkmark-filled.ts';
import ErrorFilled from '../icons/error-filled.ts';
import InformationFilled from '../icons/information-filled.ts';
import InformationSquareFilled from '../icons/information-square-filled.ts';
import WarningAltFilled from '../icons/warning-alt-filled.ts';
import WarningFilled from '../icons/warning-filled.ts';

export type NotificationKind =
  'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';

const icons = {
  error: ErrorFilled,
  success: CheckmarkFilled,
  warning: WarningFilled,
  'warning-alt': WarningAltFilled,
  info: InformationFilled,
  'info-square': InformationSquareFilled,
};

const iconFor = (kind: NotificationKind) => icons[kind];

const describe = (kind: NotificationKind, description?: string) =>
  description || `${kind} icon`;

export interface NotificationIconSignature {
  Args: {
    kind: NotificationKind;
    notificationType: 'inline' | 'toast';
    /** Defaults to `'<kind> icon'`. */
    iconDescription?: string;
  };
}

// eslint-disable-next-line ember/template-require-splattributes -- renders an icon component, which takes no attributes
const NotificationIcon: TOC<NotificationIconSignature> = <template>
  {{#let (iconFor @kind) as |KindIcon|}}
    {{#if KindIcon}}
      <KindIcon
        @size={{20}}
        @svgClass="cds--{{@notificationType}}-notification__icon"
        @title={{describe @kind @iconDescription}}
        @ariaLabel={{describe @kind @iconDescription}}
      />
    {{/if}}
  {{/let}}
</template>;

export default NotificationIcon;
