import * as React from 'react';
import { cn } from '../../lib/utils';

export function Table({ children, className, ...props }) {
  return (
    <div className="w-full overflow-x-auto [scrollbar-width:thin]">
      <table
        className={cn('w-full border-collapse text-left md:min-w-[640px]', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

function TableHead({ children, className, ...props }) {
  return (
    <thead
      className={cn(
        '[&_th]:px-6 [&_th]:py-3.5 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-border/40',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

function TableBody({ children, className, ...props }) {
  return (
    <tbody
      className={cn(
        '[&_tr]:transition-colors [&_tr:hover]:bg-muted/50 [&_tr+tr_td]:border-t [&_tr+tr_td]:border-border/30 [&_td]:px-6 [&_td]:py-4 [&_td]:text-sm [&_td]:text-muted-foreground [&_td]:align-middle [&_td:first-child]:font-medium [&_td:first-child]:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

function TableEmpty({ children, colSpan, className, ...props }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn('py-16 px-6 text-center text-sm text-muted-foreground', className)}
        {...props}
      >
        {children}
      </td>
    </tr>
  );
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = 'tr';
Table.Cell = 'td';
Table.HeaderCell = 'th';
Table.Empty = TableEmpty;
