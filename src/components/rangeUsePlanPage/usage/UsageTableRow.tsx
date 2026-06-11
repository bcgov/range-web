import React from 'react';
import { Table } from 'semantic-ui-react';

interface UsageTableRowProps {
  singleUsage: any;
}

const UsageTableRow = ({ singleUsage }: UsageTableRowProps) => {
  const { year, authorizedAum, temporaryIncrease, totalAnnualUse, totalNonUse } = singleUsage;

  return (
    <Table.Row>
      <Table.Cell>{year}</Table.Cell>
      <Table.Cell>{authorizedAum}</Table.Cell>
      <Table.Cell>{temporaryIncrease}</Table.Cell>
      <Table.Cell>{totalNonUse}</Table.Cell>
      <Table.Cell>{totalAnnualUse}</Table.Cell>
    </Table.Row>
  );
};

export default UsageTableRow;
