import React from 'react';
import { TableHeaderCell } from 'semantic-ui-react';

const SortableTableHeaderCell = ({
  column,
  children,
  currentSortBy,
  currentSortOrder,
  onClick,
  noSort = false,
}) => {
  if (noSort)
    return (
      <TableHeaderCell className="no-sort-tableheader">
        {children}
      </TableHeaderCell>
    );
  return (
    <TableHeaderCell
      sorted={currentSortBy === column ? currentSortOrder : null}
      onClick={() => onClick(column)}
    >
      {children}
    </TableHeaderCell>
  );
};
export default SortableTableHeaderCell;
