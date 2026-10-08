import { expect, waitFor } from 'storybook/test';

import type { DataTableSignature } from '../../src/components/data-table.gts';
import type TableColumn from '../../src/components/data-table/-column.gts';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';

// Rows, headers and helpers the DataTable story pages share.

export interface LoadBalancer {
  id: string;
  name: string;
  protocol: string;
  port: number;
  rule: string;
  attached_groups: string;
  status: string;
}

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

export const HEADERS = [
  { label: 'Name' },
  { label: 'Protocol' },
  { label: 'Port' },
  { label: 'Rule' },
  { label: 'Attached groups' },
  { label: 'Status' },
];

// The trailing `null` reserves the overflow-menu column.
// The row-actions column gets a visually hidden heading.
export const HEADERS_WITH_MENU = [
  ...HEADERS,
  { label: 'Actions', hideLabel: true },
];

type Column = WithBoundArgs<typeof TableColumn, 'table'>;

export const Cells: TOC<{ Args: { Column: Column; item: LoadBalancer } }> =
  <template>
    <@Column>{{@item.name}}</@Column>
    <@Column>{{@item.protocol}}</@Column>
    <@Column>{{@item.port}}</@Column>
    <@Column>{{@item.rule}}</@Column>
    <@Column>{{@item.attached_groups}}</@Column>
    <@Column>{{@item.status}}</@Column>
  </template>;

// The table shows its rows once it has set up its first page slice (on the
// next run loop), so tests wait for them first.
export const rowsRendered = (canvasElement: HTMLElement) =>
  waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr').length).toBeGreaterThan(
      0,
    ),
  );

export type TableState = Parameters<
  NonNullable<DataTableSignature<LoadBalancer>['Args']['registerState']>
>[0];

// DataTable is generic over its item type, which signature inference can't
// follow, so declare the story's args explicitly. `size`/`useZebraStyles`
// are the yielded `Table`'s args; `onBatchAction` is the story's own spy.
export type StoryArgs = Omit<
  DataTableSignature<LoadBalancer>['Args'],
  'items'
> & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  useZebraStyles?: boolean;
  onBatchAction: (action: string, items: LoadBalancer[]) => void;
};
