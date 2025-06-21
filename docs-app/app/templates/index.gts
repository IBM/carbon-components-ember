import { GitHubLink } from 'docs-app/components/header';
import { Logo } from 'docs-app/components/icons';
import Route from 'ember-route-template';
import config from 'docs-app/config/environment';
import { VersionSelector } from 'docs-app/components/version-selector';
import { Article, H2, IndexPage, InternalLink, TopRight } from '@universal-ember/docs-support';
import styles from './index.module.scss';


export default Route(
<template>
  <IndexPage>
    <:logo>
      <div style="margin: 0 auto; transform: translateY(-20%);" class="grid gap-4">
        <h1 style="filter: drop-shadow(3px 5px 0px rgba(0, 0, 0, 0.4));">
          <Logo style="margin: auto; width: fit-content;" class="dark:fill-sky-100" />
        </h1>
      </div>
    </:logo>
    <:header>
      <TopRight>
        <GitHubLink />
        <VersionSelector />
      </TopRight>
    </:header>
    <:tagline>
      <p class="text-center">
        use the Carbon Components with the Ember framework
        <br />
      </p>
    </:tagline>
    <:callToAction>
      <InternalLink
        class={{styles.getStartedLink}}
        href="{{config.rootURL}}1-get-started/index.md"
      >
        Get Started
      </InternalLink>
    </:callToAction>
    <:content>
      <Content />

      <br /><br />
      <br /><br />

      <div class="flex justify-center items-center">
        <GetStarted />
      </div>

      <br /><br />
      <br /><br />

    </:content>
    <:footer></:footer>
  </IndexPage>
</template>
);

const GetStarted = <template>
  <InternalLink href="{{config.rootURL}}1-get-started/index.md" style="transform: scale(2.5);">
    Get Started ➤
  </InternalLink>
</template>;

const Content = <template>
  <br /><br />

  <div class="mx-auto" style="width: 66%">
    <Article class="flex flex-wrap gap-12 justify-between">
      <div>
        <H2>Goals</H2>

        <ul>
          <li>use the Carbon Components with Emberjs</li>
          <li>high-quality components and utilities</li>
          <li>all tested</li>
        </ul>
      </div>

    </Article>
  </div>
</template>;
