import TableBody from '../../src/components/table/table-body.gts';
import TableCell from '../../src/components/table/table-cell.gts';
import TableHead from '../../src/components/table/table-head.gts';
import TableHeader from '../../src/components/table/table-header.gts';
import TableRow from '../../src/components/table/table-row.gts';
import { HEADERS, ROWS } from './data-table.gts';

import type { TOC } from '@ember/component/template-only';

// The load balancers' head and body, to put in a hand-built `Table`.
export const LoadBalancerRows: TOC<{ Blocks: Record<string, never> }> =
  <template>
    <TableHead>
      <TableRow>
        {{#each HEADERS as |header|}}
          <TableHeader>{{header.label}}</TableHeader>
        {{/each}}
      </TableRow>
    </TableHead>
    <TableBody>
      {{#each ROWS as |row|}}
        <TableRow>
          <TableCell>{{row.name}}</TableCell>
          <TableCell>{{row.protocol}}</TableCell>
          <TableCell>{{row.port}}</TableCell>
          <TableCell>{{row.rule}}</TableCell>
          <TableCell>{{row.attached_groups}}</TableCell>
          <TableCell>{{row.status}}</TableCell>
        </TableRow>
      {{/each}}
    </TableBody>
  </template>;
