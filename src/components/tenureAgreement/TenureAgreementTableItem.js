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
    const { tenureAgreement: agreement } = this.props;
    const recentPlan = agreement.plans[0];
    const statusName = recentPlan && recentPlan.status && recentPlan.status.name;
    const agreementId = agreement.id;
    const rangeName = agreement.rangeName;
    const primaryAgreementHolderName = agreement.primaryAgreementHolder
      && agreement.primaryAgreementHolder.name;
    const staff = agreement && agreement.zone && agreement.zone.contactName;

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