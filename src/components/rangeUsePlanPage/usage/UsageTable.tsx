import React from 'react';
import { Table as SemanticTable } from 'semantic-ui-react';

const Table = SemanticTable as any;
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
        <Table.Row>
          <Table.Cell colSpan="5" textAlign="center">
            No usage available for this period {`(${planStartYear} ~ ${planEndYear})`}
          </Table.Cell>
        </Table.Row>
      );
    }

    return filteredUsage.map((singleUsage: any) => <UsageTableRow key={singleUsage.id} singleUsage={singleUsage} />);
  };

  return (
    <Table style={{ marginTop: '10px' }} celled compact striped unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{YEAR}</Table.HeaderCell>
          <Table.HeaderCell>{AUTH_AUMS}</Table.HeaderCell>
          <Table.HeaderCell>{TEMP_INCREASE}</Table.HeaderCell>
          <Table.HeaderCell>{BILLABLE_NON_USE}</Table.HeaderCell>
          <Table.HeaderCell>{TOTAL_ANNUAL_USE}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{renderTable(usage)}</Table.Body>
    </Table>
  );
};

export default UsageTable;
