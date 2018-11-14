import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import UsageTableRow from './UsageTableRow';
import { YEAR, AUTH_AUMS, TEMP_INCREASE, BILLABLE_NON_USE, TOTAL_ANNUAL_USE } from '../../../constants/strings';

class UsageTable extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  renderTable = (usage) => {
    const { plan } = this.props;
    const { planEndDate, planStartDate } = plan;
    const planStartYear = new Date(planStartDate).getFullYear();
    const planEndYear = new Date(planEndDate).getFullYear();

    const filteredUsage = usage
      .filter(u => (u.year >= planStartYear && u.year <= planEndYear));

    if (filteredUsage.length === 0) {
      return (
        <Table.Row>
          <Table.Cell colSpan="5" textAlign="center">
            No usage available for this period {`(${planStartYear} ~ ${planEndYear})`}
          </Table.Cell>
        </Table.Row>
      );
    }

    return filteredUsage.map(this.renderRow);
  }

  renderRow = singleUsage => (
    <UsageTableRow
      key={singleUsage.id}
      singleUsage={singleUsage}
    />
  )

  render() {
    const { usage } = this.props;

    return (
      <Table
        style={{ marginTop: '10px' }}
        celled
        compact
        striped
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{YEAR}</Table.HeaderCell>
            <Table.HeaderCell>{AUTH_AUMS}</Table.HeaderCell>
            <Table.HeaderCell>{TEMP_INCREASE}</Table.HeaderCell>
            <Table.HeaderCell>{BILLABLE_NON_USE}</Table.HeaderCell>
            <Table.HeaderCell>{TOTAL_ANNUAL_USE}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.renderTable(usage)}
        </Table.Body>
      </Table>
    );
  }
}

export default UsageTable;
