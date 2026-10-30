/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import TabPanel from './tab-panel.gts';
import type Tabs from '../tabs.gts';

export interface TabPanelsSignature {
  Args: {
    tabs: Tabs;
  };
  Blocks: {
    default: [TabPanel: WithBoundArgs<typeof TabPanel, 'tabs'>];
  };
}

// eslint-disable-next-line ember/template-require-splattributes -- renders no element of its own; each TabPanel takes the attributes
const TabPanels: TOC<TabPanelsSignature> = <template>
  {{yield (component TabPanel tabs=@tabs)}}
</template>;

export default TabPanels;
