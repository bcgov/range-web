import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TenureAgreementListItem from './TenureAgreementListItem';
import { Table } from 'semantic-ui-react';
import { RAN, TENURE_HOLDER_NAME, TENURE_REGION, STATUS } from '../../constants/strings';

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
              <Table.HeaderCell>{RAN}</Table.HeaderCell>
              <Table.HeaderCell>{TENURE_HOLDER_NAME}</Table.HeaderCell>
              <Table.HeaderCell>{TENURE_REGION}</Table.HeaderCell>
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