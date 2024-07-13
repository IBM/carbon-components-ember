import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ChartsController extends Controller {

  @tracked start = 0;

  get sinus() {
    const values: any = [];
    const start = this.start * 2 * Math.PI / 200;
    let c = 0;
    for (let i=start; i < start + 2 * Math.PI; i += Math.PI / 100) {
      c++;
      values.push({
        date: c,
        value: Math.sin(i)
      });
    }
    setTimeout(() => {
      // eslint-disable-next-line ember/no-side-effects
      this.start += 1;
      if (start === 200) {
        // eslint-disable-next-line ember/no-side-effects
        this.start = 0;
      }
    }, 100);
    return values;
  }
}
