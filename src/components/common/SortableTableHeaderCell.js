import React from 'react'
import { TableHeaderCell } from 'semantic-ui-react'
import { useEditable } from '../../providers/EditableProvider'

const SortableTableHeaderCell = ({
  column,
  children,
  currentSortBy,
  currentSortOrder,
  onClick,
  noSort = false
}) => {
  const isEditable = useEditable()

  return noSort || !isEditable ? (
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
}
export default SortableTableHeaderCell
