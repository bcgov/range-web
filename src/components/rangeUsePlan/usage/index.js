import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import UsageTableRow from './UsageTableRow';
import { YEAR, AUTH_AUMS, TEMP_INCREASE, BILLABLE_NON_USE, TOTAL_ANNUAL_USE } from '../../../constants/strings';

class UsageTable extends Component {
  static propTypes = {
    plan: PropTypes.arrayOf(PropTypes.object).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string.isRequired,
  };

  renderTable = (usage) => {
    const { plan } = this.props;
    const { planEndDate, planStartDate } = plan;

    return usage
      .filter(su => su.year > 2033)
      .map(this.renderRow);
  }

  renderRow = singleUsage => (
    <UsageTableRow
      key={singleUsage.id}
      singleUsage={singleUsage}
    />
  )

  render() {
    const { className, usage } = this.props;

    return (
      <div className={className}>
        <div className="rup__content-title">Range Usage</div>
        <div className="rup__divider" />
        <Table
          style={{ marginTop: '15px' }}
          celled
          padded
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
      </div>
    );
  }
}

export default UsageTable;
