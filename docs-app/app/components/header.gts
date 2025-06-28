import { ExternalLink } from 'ember-primitives';

import { Flask, GitHub } from '@universal-ember/docs-support/icons';

export const TestsLink = <template>
  <ExternalLink href="/tests" class="group" aria-label="Tests">
    <Flask
      class="w-6 h-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
    />
  </ExternalLink>
</template>;

export const GitHubLink = <template>
  <ExternalLink
    class="group"
    href="https://github.com/IBM/carbon-components-ember"
    aria-label="GitHub"
  >
    <GitHub
      class="w-6 h-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
    />
  </ExternalLink>
</template>;
