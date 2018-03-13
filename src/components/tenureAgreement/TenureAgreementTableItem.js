import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Status } from '../common';

const propTypes = {
  tenureAgreement: PropTypes.object.isRequired,
};

const defaultProps = {
  tenureAgreement: {},
};

export class TenureAgreementTableItem extends Component {
  onRowClicked = () => {
    const { tenureAgreement, history } = this.props;
    history.push(`${RANGE_USE_PLAN}/${tenureAgreement.id}`)
  }

  render() {
    const { tenureAgreement } = this.props;

    return (
      <Table.Row
        className="tenure-agreement-table-item"
        onClick={this.onRowClicked}
      >
        <Table.Cell>{tenureAgreement.agreementId}</Table.Cell>
        <Table.Cell>{tenureAgreement.rangeName}</Table.Cell>
        <Table.Cell>{`Agreement holder ${tenureAgreement.id}`}</Table.Cell>
        <Table.Cell>{`Staff Contact${tenureAgreement.id}`}</Table.Cell>
        <Table.Cell><Status status={"Pending" || tenureAgreement.status}/></Table.Cell>
      </Table.Row>
    );
  }
}

TenureAgreementTableItem.propTypes = propTypes;
TenureAgreementTableItem.defaultProps = defaultProps;
export default withRouter(TenureAgreementTableItem);