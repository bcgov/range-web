import React from 'react'
import { TableHeaderCell } from 'semantic-ui-react'

const SortableTableHeaderCell = ({
  column,
  children,
  currentSortBy,
  currentSortOrder,
  onClick,
  noSort = false
}) =>
  noSort ? (
    <TableHeaderCell className="no-sort-tableheader">
      {children}
    </TableHeaderCell>
  ) : (
    <TableHeaderCell
      sorted={currentSortBy === column ? currentSortOrder : null}
      onClick={() => onClick(column)}>
      {children}
    </TableHeaderCell>
  )

export default SortableTableHeaderCell
