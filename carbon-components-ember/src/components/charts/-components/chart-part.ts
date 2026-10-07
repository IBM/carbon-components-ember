import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { registerDestructor } from '@ember/destroyable';
import { runTask } from 'ember-lifeline';
import type CarbonChart from './chart.gts';

/**
 * Base class for the parts a chart yields (`Axis`, `TabularData`,
 * `ColorScale`, `ColorPairing`). A part renders nothing: it registers itself
 * with its chart, which derives its options and data from the registered
 * parts' args.
 */
export default class ChartPart<
  S extends { Args: { chart?: CarbonChart | null } },
> extends Component<S> {
  constructor(owner: Owner, args: S['Args']) {
    super(owner, args);
    // The chart has already read its parts while rendering, so registering
    // during that render would trip the backtracking-rerender assertion.
    // `runTask` defers it to the next run loop, and cancels itself if this
    // part is torn down first.
    runTask(this, () => {
      const chart = args.chart;
      if (!chart) return;
      chart.register(this);
      registerDestructor(this, () => chart.unregister(this));
    });
  }
}

/**
 * A registered part, whatever its args. The chart tells parts apart with
 * `instanceof`. (A component type would need its exact signature.)
 */
export type AnyChartPart = object;
