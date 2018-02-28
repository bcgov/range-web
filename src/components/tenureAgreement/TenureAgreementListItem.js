import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TENURE_AGREEMENT } from '../../constants/routes';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const propTypes = {
  tenureAgreement: PropTypes.object.isRequired,
};

const defaultProps = {
  tenureAgreement: {},
};

export class TenureAgreementListItem extends Component {
  onRowClicked = () => {
    const { tenureAgreement, history } = this.props;
    history.push(`${TENURE_AGREEMENT}/${tenureAgreement.id}`)
  }

  render() {
    const { tenureAgreement } = this.props;

    return (
      <Table.Row 
        className="tenure-agreement-list-item"
        onClick={this.onRowClicked}
      >
        <Table.Cell>{`RAN${tenureAgreement.number}`}</Table.Cell>
        <Table.Cell>{tenureAgreement.region}</Table.Cell>
        <Table.Cell>{tenureAgreement.tenureHolder.name}</Table.Cell>
        <Table.Cell>{tenureAgreement.rangeOfficer.name}</Table.Cell>
        <Table.Cell>{tenureAgreement.status}</Table.Cell>
      </Table.Row>
    );
  }
}

TenureAgreementListItem.propTypes = propTypes;
TenureAgreementListItem.defaultProps = defaultProps;
export default withRouter(TenureAgreementListItem);