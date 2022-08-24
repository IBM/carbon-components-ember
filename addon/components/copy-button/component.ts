import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { AttrValue } from '@glint/template';


type Args = {
  targetElementId: string;
  targetElement: Element;

};

export default class CarbonCopyButton extends Component<Args> {
  carbonElement: any;
  @tracked didCopy: boolean;
  get options() {
    return {
      targetElement: this.args.targetElement,
      targetElementId: this.args.targetElementId
    };
  }

  @action
  loadCarbonComponent(carbonElement) {
    this.carbonElement = carbonElement;
  }

  @action
  copyToClipboard(): AttrValue {
    let targetElement: any = this.options.targetElement;
    if (!targetElement && this.options.targetElementId) {
      targetElement = document.getElementById(this.options.targetElementId);
    }
    targetElement = targetElement || this.carbonElement;
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
    this.didCopy = true;
    setTimeout(() => {
      this.didCopy = false
    }, 3000);
  }
}
