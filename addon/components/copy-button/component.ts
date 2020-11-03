import Component from '@glimmer/component';
import { action } from '@ember/object';
import CopyButton from 'carbon-components/es/components/copy-button/copy-button';


class MyCopyButton extends CopyButton {
  constructor(carbonElement: any, options: { targetElementId: string; targetElement: Element }) {
    super(carbonElement, options)
  }

  options: {
    targetElementId: string;
    targetElement: Element;
  };
  element: Element;

  copyToClipboard() {
    let targetElement: any = this.options.targetElement;
    if (!targetElement && this.options.targetElementId) {
      targetElement = document.getElementById(this.options.targetElementId);
    }
    targetElement = targetElement || this.element;
    const el = document.createElement('textarea'); // Create a <textarea> element
    // Set its value to the string that you want copied
    el.value = targetElement.textContent.trim().split('\n').map(x => x.trim()).join('\n');
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected = document.getSelection()!.rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection()!.getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) { // If a selection existed before copying
      document.getSelection()!.removeAllRanges(); // Unselect everything on the HTML document
      document.getSelection()!.addRange(selected); // Restore the original selection
    }
  }

  handleClick(...args) {
    super.handleClick(...args);
    this.copyToClipboard();
  }
}

type Args = {
  targetElementId: string;
  targetElement: Element;

};

export default class CarbonCopyButton extends Component<Args> {
  carbonComponent: any;
  get options() {
    return {
      targetElement: this.args.targetElement,
      targetElementId: this.args.targetElementId
    };
  }

  @action
  loadCarbonComponent(carbonElement) {
    this.destroyCarbonComponent();
    const options = this.options;
    options.targetElement = options.targetElement || carbonElement;
    this.carbonComponent = new MyCopyButton(carbonElement, this.options);
  }

  @action
  destroyCarbonComponent(element?) {
    if (element && (!this.carbonComponent || this.carbonComponent.element !== element)) return;
    this.carbonComponent && this.carbonComponent.release();
    this.carbonComponent = null;
  }
}
