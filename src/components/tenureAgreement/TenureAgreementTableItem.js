import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Status } from '../common';
import { NOT_PROVIDED } from '../../constants/strings';
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
    const statusName = tenureAgreement.status && tenureAgreement.status.name;
    const agreementId = tenureAgreement.id;
    const rangeName = tenureAgreement.rangeName;
    const primaryAgreementHolderName = tenureAgreement.primaryAgreementHolder
      && tenureAgreement.primaryAgreementHolder.name;
    const staff = `Staff Contact ${Math.floor((Math.random() * 10) + 1)}`;

    return (
      <Table.Row
        className="tenure-agreement-table-item"
        onClick={this.onRowClicked}
      >
        <Table.Cell>{agreementId}</Table.Cell>
        <Table.Cell>{rangeName || NOT_PROVIDED}</Table.Cell>
        <Table.Cell>{primaryAgreementHolderName || NOT_PROVIDED}</Table.Cell>
        <Table.Cell>{staff || NOT_PROVIDED}</Table.Cell>
        <Table.Cell><Status status={statusName}/></Table.Cell>
      </Table.Row>
    );
  }
}

TenureAgreementTableItem.propTypes = propTypes;
TenureAgreementTableItem.defaultProps = defaultProps;
export default withRouter(TenureAgreementTableItem);