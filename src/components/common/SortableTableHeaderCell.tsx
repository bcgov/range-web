import React from 'react';
import { TableHeaderCell } from 'semantic-ui-react';

interface SortableTableHeaderCellProps {
  column: string;
  children?: React.ReactNode;
  currentSortBy: string;
  currentSortOrder: 'ascending' | 'descending' | undefined;
  onClick: (column: string) => void;
  noSort?: boolean;
}

function SortableTableHeaderCell({
  column,
  children,
  currentSortBy,
  currentSortOrder,
  onClick,
  noSort = false,
}: SortableTableHeaderCellProps) {
  if (noSort) return <TableHeaderCell className="no-sort-tableheader">{children}</TableHeaderCell>;
  return (
    <TableHeaderCell sorted={currentSortBy === column ? currentSortOrder : undefined} onClick={() => onClick(column)}>
      {children}
    </TableHeaderCell>
  );
}
export default SortableTableHeaderCell;
