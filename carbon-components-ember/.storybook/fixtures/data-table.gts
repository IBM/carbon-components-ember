import type {
  DataTableHeader,
  DataTableSignature,
} from '../../src/components/data-table.gts';

// Rows, headers and arguments the DataTable story pages share, as Carbon
// React's `stories/shared.js`.

// A type alias, not an interface, so a row is a `DataTableInputRow`.
export type LoadBalancer = {
  id: string;
  name: string;
  protocol: string;
  port: number;
  rule: string;
  attached_groups: string;
  status: string;
};

export const ROWS: LoadBalancer[] = [
  {
    id: 'a',
    name: 'Load Balancer 3',
    protocol: 'HTTP',
    port: 3000,
    rule: 'Round robin',
    attached_groups: 'Kevin’s VM Groups',
    status: 'Disabled',
  },
  {
    id: 'b',
    name: 'Load Balancer 1',
    protocol: 'HTTP',
    port: 443,
    rule: 'Round robin',
    attached_groups: 'Maureen’s VM Groups',
    status: 'Starting',
  },
  {
    id: 'c',
    name: 'Load Balancer 2',
    protocol: 'HTTP',
    port: 80,
    rule: 'DNS delegation',
    attached_groups: 'Andrew’s VM Groups',
    status: 'Active',
  },
  {
    id: 'd',
    name: 'Load Balancer 6',
    protocol: 'HTTP',
    port: 3000,
    rule: 'Round robin',
    attached_groups: 'Marc’s VM Groups',
    status: 'Disabled',
  },
  {
    id: 'e',
    name: 'Load Balancer 4',
    protocol: 'HTTP',
    port: 443,
    rule: 'Round robin',
    attached_groups: 'Mel’s VM Groups',
    status: 'Starting',
  },
  {
    id: 'f',
    name: 'Load Balancer 5',
    protocol: 'HTTP',
    port: 80,
    rule: 'DNS delegation',
    attached_groups: 'Ronja’s VM Groups',
    status: 'Active',
  },
];

const PORTS = [3000, 443, 80];
const RULES = ['Round robin', 'DNS delegation'];
const STATUSES = ['Disabled', 'Starting', 'Active'];

export const MANY_ROWS: LoadBalancer[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: `load-balancer-${i + 1}`,
    name: `Load Balancer ${i + 1}`,
    protocol: 'HTTP',
    port: PORTS[i % 3]!,
    rule: RULES[i % 2]!,
    attached_groups: `Group ${(i % 5) + 1}`,
    status: STATUSES[i % 3]!,
  }),
);

export const HEADERS: DataTableHeader[] = [
  { key: 'name', header: 'Name' },
  { key: 'protocol', header: 'Protocol' },
  { key: 'port', header: 'Port' },
  { key: 'rule', header: 'Rule' },
  { key: 'attached_groups', header: 'Attached groups' },
  { key: 'status', header: 'Status' },
];

// The args every DataTable page sets, with the controls for them.
export const DATA_TABLE_ARGS = {
  isSortable: false,
  locale: 'en',
  size: 'lg' as const,
  stickyHeader: false,
  useStaticWidth: false,
  useZebraStyles: false,
};

export const DATA_TABLE_ARG_TYPES = {
  filterRows: { control: false as const },
  headers: { control: false as const },
  isSortable: { control: 'boolean' as const },
  locale: { control: 'text' as const },
  rows: { control: false as const },
  size: {
    control: 'select' as const,
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  sortRow: { control: false as const },
  stickyHeader: { control: 'boolean' as const },
  translateWithId: { control: false as const },
  useStaticWidth: { control: 'boolean' as const },
  useZebraStyles: { control: 'boolean' as const },
};

// DataTable is generic over its rows, which story args can't infer.
export type TableArgs = DataTableSignature<LoadBalancer>['Args'];
