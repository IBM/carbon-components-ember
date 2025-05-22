import Application from 'test-app/app';
import config from 'test-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { setupQunit } from './setup-harness';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

setupQunit();

QUnit.done(() => {
  const actuals = [...document.getElementsByClassName('test-actual')];
  actuals.forEach((actual) => {
    const button = document.createElement('button');
    button.textContent = 'Copy Actual';
    button.style.position = 'relative';
    actual.parentElement.insertAdjacentElement('afterbegin', button);
    button.addEventListener('click', () => {
      const text = actual.getElementsByTagName('pre')[0].textContent;
      navigator.clipboard.writeText(text);
    })
  })
})

export { start };
