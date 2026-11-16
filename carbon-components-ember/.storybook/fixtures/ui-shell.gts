import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { RenderStory } from 'ember-storybook';

import Button from '../../src/components/button.gts';
import Modal from '../../src/components/modal.gts';
import Content from '../../src/components/ui-shell/content.gts';

import type { Decorator } from 'ember-storybook';
import '#storybook/styles/fixtures/ui-shell.css';

// The page and frame the UI Shell story pages share, and their args.

export type StoryArgs = {
  headerAriaLabel: string;
  platformName: string;
  platformPrefix: string;
  sideNavAriaLabel: string;
  onAction: () => void;
};

export const headerArgs = {
  headerAriaLabel: 'IBM Platform Name',
  platformName: '[Platform]',
  platformPrefix: 'IBM',
};

export const navigationArgs = {
  navigationAriaLabel: 'IBM [Platform]',
  navigationMenuLabel: 'Link 4',
};

export const sideNavArgs = {
  sideNavAriaLabel: 'Side navigation',
};

export const withShellFrame: Decorator = (Story, context) => <template>
  <div class="fixtures-ui-shell-story__frame">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
</template>;

interface StoryContentSignature {
  Args: {
    /** Leaves room on the left for a side nav from `lg`. Defaults to `true`. */
    useResponsiveOffset?: boolean;
  };
}

// Carbon React's StoryContent: the page beside the shell.
export class StoryContent extends Component<StoryContentSignature> {
  @tracked open = false;

  get offset() {
    return this.args.useResponsiveOffset !== false;
  }

  openModal = () => (this.open = true);
  closeModal = () => (this.open = false);

  <template>
    <Content
      id="main-content"
      class="fixtures-ui-shell-story__content
        {{if this.offset 'fixtures-ui-shell-story__content--offset'}}"
    >
      <h2 class="fixtures-ui-shell-story__heading">Purpose and function</h2>
      <p>
        The shell is perhaps the most crucial piece of any UI built with
        <a href="https://www.carbondesignsystem.com/">Carbon</a>. It contains
        the shared navigation framework for the entire design system and ties
        the products in IBM’s portfolio together in a cohesive and elegant way.
        The shell is the home of the topmost navigation, where users can quickly
        and dependably gain their bearings and move between pages.
      </p>
      <h2 class="fixtures-ui-shell-story__heading">Header responsive behavior</h2>
      <p>
        As a header scales down to fit smaller screen sizes, headers with
        persistent side nav menus should have the side nav collapse into
        “hamburger” menu. See the example to better understand responsive
        behavior of the header.
      </p>
      <h2 class="fixtures-ui-shell-story__heading">Secondary navigation</h2>
      <p>
        The side-nav contains secondary navigation and fits below the header. It
        can be configured to be either fixed-width or flexible, with only one
        level of nested items allowed. Both links and category lists can be used
        in the side-nav and may be mixed together.
      </p>
      <Button {{on "click" this.openModal}}>Launch modal</Button>
      <Modal
        @modalHeading="Add a custom domain"
        @modalLabel="Account resources"
        @primaryButtonText="Add"
        @secondaryButtonText="Cancel"
        @open={{this.open}}
        @onRequestClose={{this.closeModal}}
      >
        <p class="fixtures-ui-shell-story__modal-text">
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </p>
      </Modal>
    </Content>
  </template>
}
