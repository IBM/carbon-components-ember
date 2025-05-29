import 'qunit-dom';
// @ts-expect-error okay
import Application from 'test-app/app';
// @ts-expect-error okay
import config from 'test-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { setupQunit } from './setup-harness';
import { setupSnapshot } from './setup-snapshot.ts';

setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupSnapshot(QUnit.assert);

setupQunit();

QUnit.done(() => {
  // @ts-expect-error pass
  const actuals = [...document.getElementsByClassName('test-actual')];
  actuals.forEach((actual) => {
    const button = document.createElement('button');
    button.textContent = 'Copy Actual';
    button.style.position = 'relative';
    actual.parentElement.insertAdjacentElement('afterbegin', button);
    button.addEventListener('click', () => {
      const text = actual.getElementsByTagName('pre')[0].textContent;
      void navigator.clipboard.writeText(text);
    })
  })
});

export { start };
