import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RangeUsePlansTableItem from './RangeUsePlansTableItem';
import { Table } from 'semantic-ui-react';
import { RANGE_NUMBER, AGREEMENT_HOLDER, STAFF_CONTACT ,RANGE_NAME, STATUS } from '../../constants/strings';

const propTypes = {
  rangeUsePlans: PropTypes.array.isRequired,
}

const defaultProps = {
  rangeUsePlans: []
}

export class RangeUsePlansTable extends Component {
  render() {
    const { rangeUsePlans } = this.props; 

    return (
      <Table singleLine selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{RANGE_NUMBER}</Table.HeaderCell>
            <Table.HeaderCell>{RANGE_NAME}</Table.HeaderCell>
            <Table.HeaderCell>{AGREEMENT_HOLDER}</Table.HeaderCell>
            <Table.HeaderCell>{STAFF_CONTACT}</Table.HeaderCell>
            <Table.HeaderCell>{STATUS}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
    
        <Table.Body>
          {rangeUsePlans.map((rangeUsePlan, index) => {
            return (
              <RangeUsePlansTableItem 
                key={index}
                rangeUsePlan={rangeUsePlan}
              />
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

RangeUsePlansTable.propTypes = propTypes;
RangeUsePlansTable.defaultProps = defaultProps;
export default RangeUsePlansTable;