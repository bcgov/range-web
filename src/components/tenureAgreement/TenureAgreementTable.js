import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TenureAgreementTableItem from './TenureAgreementTableItem';
import { Table, Form as Loader, Pagination, Icon } from 'semantic-ui-react';
import { RANGE_NUMBER, AGREEMENT_HOLDER, STAFF_CONTACT ,RANGE_NAME, STATUS } from '../../constants/strings';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

const defaultProps = {
  tenureAgreements: [],
}

export class TenureAgreementTable extends Component {
  state = {
    activePage: 1,
  }

  // handlePaginationChange = (e, { activePage }) => this.setState({ activePage })
  
  render() {
    // const { activePage } = this.state;
    const { tenureAgreements, isLoading } = this.props;

    return (
      <Loader loading={isLoading}>
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
            {tenureAgreements.map((tenureAgreement) => {
              return (
                <TenureAgreementTableItem 
                  key={tenureAgreement.id}
                  tenureAgreement={tenureAgreement}
                />
              );
            })}
          </Table.Body>
        </Table>

        {/* <Pagination 
          size='mini'
          activePage={activePage}
          onPageChange={this.handlePaginationChange} 
          totalPages={totalPages}
          ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
          firstItem={{ content: <Icon name='angle double left' />, icon: true }}
          lastItem={{ content: <Icon name='angle double right' />, icon: true }}
          prevItem={{ content: <Icon name='angle left' />, icon: true }}
          nextItem={{ content: <Icon name='angle right' />, icon: true }}
        /> */}
      </Loader>
    );
  }
}

TenureAgreementTable.propTypes = propTypes;
TenureAgreementTable.defaultProps = defaultProps;
export default TenureAgreementTable;