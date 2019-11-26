import Component from '@ember/component';
import { action } from '@ember/object';
import CopyButton from 'carbon-components/es/components/copy-button/copy-button';


class MyCopyButton extends CopyButton {
  copyToClipboard() {
    let targetElement = this.options.targetElement;
    if (!targetElement && this.options.targetElementId) {
      targetElement = document.getElementById(this.options.targetElementId);
    }
    targetElement = targetElement || this.element;
    const el = document.createElement('textarea'); // Create a <textarea> element
    el.value = targetElement.textContent.trim(); // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected = document.getSelection().rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) { // If a selection existed before copying
      document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
      document.getSelection().addRange(selected); // Restore the original selection
    }
  }

  handleClick(...args) {
    super.handleClick(...args);
    this.copyToClipboard();
  }
}

export default class CarbonCopyButton extends Component {
  tagName = '';
  carbonElement = null;
  carbonComponent = null;
  ownElement = null;

  get options() {
    return {
      targetElement: this.targetElement || this.ownElement,
      targetElementId: this.attrs.targetElementId
    };
  }

  @action
  loadCarbonComponent() {
    this.carbonComponent = new MyCopyButton(this.carbonElement, this.options);
  }

  @action
  destroyCarbonComponent() {
    return this.carbonComponent && this.carbonComponent.release();
  }
}
