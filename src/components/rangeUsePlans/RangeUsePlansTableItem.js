import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Status } from '../common';

const propTypes = {
  rangeUsePlan: PropTypes.object.isRequired,
};

const defaultProps = {
  rangeUsePlan: {},
};

export class RangeUsePlansTableItem extends Component {
  onRowClicked = () => {
    const { rangeUsePlan, history } = this.props;
    history.push(`${RANGE_USE_PLAN}/${rangeUsePlan.id}`)
  }

  render() {
    const { rangeUsePlan } = this.props;

    return (
      <Table.Row
        className="range-use-plans-table-item"
        onClick={this.onRowClicked}
      >
        <Table.Cell>{`RAN07123${rangeUsePlan.number}`}</Table.Cell>
        <Table.Cell>{rangeUsePlan.region}</Table.Cell>
        <Table.Cell>{rangeUsePlan.tenureHolder.name}</Table.Cell>
        <Table.Cell>{rangeUsePlan.rangeOfficer.name}</Table.Cell>
        <Table.Cell><Status status={rangeUsePlan.status}/></Table.Cell>
      </Table.Row>
    );
  }
}

RangeUsePlansTableItem.propTypes = propTypes;
RangeUsePlansTableItem.defaultProps = defaultProps;
export default withRouter(RangeUsePlansTableItem);