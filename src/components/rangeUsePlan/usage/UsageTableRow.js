import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

class UsageTableRow extends Component {
  static propTypes = {
    singleUsage: PropTypes.shape({}).isRequired,
  }

  render() {
    const { singleUsage } = this.props;
    const {
      year,
      authorizedAum,
      temporaryIncrease,
      totalAnnualUse,
      totalNonUse,
    } = singleUsage;

    return (
      <Table.Row>
        <Table.Cell>
          {year}
        </Table.Cell>
        <Table.Cell>
          {authorizedAum}
        </Table.Cell>
        <Table.Cell>
          {temporaryIncrease}
        </Table.Cell>
        <Table.Cell>
          {totalNonUse}
        </Table.Cell>
        <Table.Cell>
          {totalAnnualUse}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default UsageTableRow;
