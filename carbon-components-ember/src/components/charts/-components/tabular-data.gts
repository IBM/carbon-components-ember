import ChartPart from './chart-part.ts';
import { defaultArgs } from '../../../utils/decorators.ts';
import type CarbonChart from '../../charts/-components/chart.gts';
import type { ChartData } from '../../charts/-components/chart.gts';

export interface ChartTabularDataSignature {
  Args: {
    backgroundColors?: string[];
    group: string;
    chart?: CarbonChart;
    values?: number[];
    dates?: Date[];
    keys?: string[];
    data?: ChartData[];
  };
}

export default class ChartTabularData extends ChartPart<ChartTabularDataSignature> {
  @defaultArgs
  args: ChartTabularDataSignature['Args'] = {
    /**
     * The Dataset label
     */
    group: '',

    values: [],
    keys: [],
    dates: [],
    chart: undefined,
    data: [],
    backgroundColors: undefined,
  };

  /**
   * This group's points: a copy of `@data` tagged with `@group`, or one point
   * per `@values` entry with the matching `@keys`/`@dates` entry.
   */
  get data(): ChartData[] {
    const group = this.args.group;
    if (this.args.data?.length) {
      return this.args.data.map((point) => ({ ...point, group }));
    }
    return (this.args.values ?? []).map((value, i) => ({
      date: this.args.dates?.[i] || undefined,
      key: this.args.keys?.[i] || undefined,
      value,
      group,
    }));
  }

  // eslint-disable-next-line ember/template-require-splattributes -- configures its chart; renders nothing
  <template></template>
}
