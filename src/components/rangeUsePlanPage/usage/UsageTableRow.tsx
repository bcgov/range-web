import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface UsageTableRowProps {
  singleUsage: any;
}

const UsageTableRow = ({ singleUsage }: UsageTableRowProps) => {
  const { year, authorizedAum, temporaryIncrease, totalAnnualUse, totalNonUse } = singleUsage;

  return (
    <TableRow>
      <TableCell>{year}</TableCell>
      <TableCell>{authorizedAum}</TableCell>
      <TableCell>{temporaryIncrease}</TableCell>
      <TableCell>{totalNonUse}</TableCell>
      <TableCell>{totalAnnualUse}</TableCell>
    </TableRow>
  );
};

export default UsageTableRow;
