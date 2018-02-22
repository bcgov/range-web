import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TenureAgreementListItem from './TenureAgreementListItem';
import { Table } from 'semantic-ui-react';
import { RANGE_NUMBER, TENURE_HOLDER, RANGE_NAME, STATUS } from '../../constants/strings';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
}

const defaultProps = {
  tenureAgreements: []
}

class TenureAgreementList extends Component {
  render() {
    const { tenureAgreements } = this.props; 

    return (
      <div className="tenure-agreement-list">
        <Table singleLine selectable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{RANGE_NUMBER}</Table.HeaderCell>
              <Table.HeaderCell>{RANGE_NAME}</Table.HeaderCell>
              <Table.HeaderCell>{TENURE_HOLDER}</Table.HeaderCell>
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