import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import UsageTableRow from './UsageTableRow';
import { YEAR, AUTH_AUMS, TEMP_INCREASE, BILLABLE_NON_USE, TOTAL_ANNUAL_USE } from '../../../constants/strings';

interface UsageTableProps {
  plan: any;
  usage: any[];
}

const UsageTable = ({ plan, usage }: UsageTableProps) => {
  const renderTable = (usageData: any[]) => {
    const { planEndDate, planStartDate } = plan;
    const planStartYear = new Date(planStartDate).getFullYear();
    const planEndYear = new Date(planEndDate).getFullYear();

    const filteredUsage = usageData.filter((u: any) => u.year >= planStartYear && u.year <= planEndYear);

    if (filteredUsage.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No usage available for this period {`(${planStartYear} ~ ${planEndYear})`}
          </TableCell>
        </TableRow>
      );
    }

    return filteredUsage.map((singleUsage: any) => <UsageTableRow key={singleUsage.id} singleUsage={singleUsage} />);
  };

  return (
    <Table sx={{ mt: '10px' }} size="small">
      <TableHead>
        <TableRow>
          <TableCell>{YEAR}</TableCell>
          <TableCell>{AUTH_AUMS}</TableCell>
          <TableCell>{TEMP_INCREASE}</TableCell>
          <TableCell>{BILLABLE_NON_USE}</TableCell>
          <TableCell>{TOTAL_ANNUAL_USE}</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>{renderTable(usage)}</TableBody>
    </Table>
  );
};

export default UsageTable;
