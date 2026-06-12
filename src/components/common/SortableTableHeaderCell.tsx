import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

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
  if (noSort) {
    return <TableCell className="no-sort-tableheader">{children}</TableCell>;
  }
  const direction = currentSortBy === column ? (currentSortOrder === 'ascending' ? 'asc' : 'desc') : undefined;
  return (
    <TableCell sortDirection={direction}>
      <TableSortLabel active={currentSortBy === column} direction={direction} onClick={() => onClick(column)}>
        {children}
      </TableSortLabel>
    </TableCell>
  );
}

export default SortableTableHeaderCell;
