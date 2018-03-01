import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TenureAgreementListItem from './TenureAgreementListItem';
import { Table } from 'semantic-ui-react';
import { RANGE_NUMBER, AGREEMENT_HOLDER, STAFF_CONTACT ,RANGE_NAME, STATUS } from '../../constants/strings';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
}

const defaultProps = {
  tenureAgreements: []
}

export class TenureAgreementList extends Component {
  render() {
    const { tenureAgreements } = this.props; 

    return (
      <div className="tenure-agreement-list">
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
            {tenureAgreements.map((tenureAgreement, index) => {
              return (
                <TenureAgreementListItem 
                  key={index}
                  tenureAgreement={tenureAgreement}
                />
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

TenureAgreementList.propTypes = propTypes;
TenureAgreementList.defaultProps = defaultProps;
export default TenureAgreementList;