/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

import Mixin from '@ember/object/mixin';
import { defineProperty, computed } from '@ember/object';

export default Mixin.create({
  init(...args) {
    this._super(...args);
    const mapping = {};
    const attrs = this.classMappings.map(m => m.split(':'));
    attrs.forEach(([a, c]) => {
      mapping[a] = this.classPrefix + c;
    });
    const props = attrs.map(a => `attrs.${a[0]}`);
    defineProperty(this, 'bxClassNames', computed(props.join(','),
      () => attrs.map(a => a[0]).map(a => ((String(this[a]) === 'true') ? mapping[a] : null)).compact().join(' ')));
  }
});
