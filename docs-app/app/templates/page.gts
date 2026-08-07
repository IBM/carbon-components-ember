import { EditThisPage } from 'docs-app/components/edit-this-page';
import { GitHubLink, TestsLink } from 'docs-app/components/header';
import { Logo, Logomark } from 'docs-app/components/icons';
import { ExternalLink } from 'ember-primitives';
import Route from 'ember-route-template';

import { OopsError, PageLayout } from '@universal-ember/docs-support';

export default Route(
  <template>
    <PageLayout>
      <:logoLink>
        <Logo class="h-9 w-28 lg:hidden" />
        <Logo class="hidden w-auto h-9 fill-slate-700 lg:block dark:fill-sky-100" />
      </:logoLink>
      <:topRight>
        <GitHubLink />
      </:topRight>
      <:error as |error|>
        <OopsError @error={{error}}>
          If you have a GitHub account (and the time),
          <ReportingAnIssue />
          would be most helpful! 🎉
        </OopsError>
      </:error>
      <:editLink as |Link|>
        <EditThisPage @link={{Link}} />
      </:editLink>
    </PageLayout>
  </template>
);

const ReportingAnIssue = <template>
  <ExternalLink href="https://github.com/IBM/carbon-components-ember/issues/new">
    reporting an issue
  </ExternalLink>
</template>;
