import { addons } from 'storybook/manager-api';

import registerSiteTools from './site-tools.ts';
import theme from './theme.ts';

registerSiteTools();
addons.setConfig({ theme });
