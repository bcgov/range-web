import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Status } from '../common';
import { NOT_PROVIDED } from '../../constants/strings';
const propTypes = {
  agreement: PropTypes.object.isRequired,
};

const defaultProps = {
  agreement: {},
};

export class AgreementTableItem extends Component {
  onRowClicked = () => {
    const { agreement, history } = this.props;
    // if (agreement && agreement.plans.length !== 0) {
      history.push(`${RANGE_USE_PLAN}/${agreement.id}`);
    // } else {
      // alert("No range use plan found!");
    // }
    // history.push(`${RANGE_USE_PLAN}/${agreement.id}/${agreement.plan[0]}`)
  }

  render() {
    const { agreement } = this.props;
    const plans = agreement.plans;
    const plan = plans[0];
    const statusName = plan && plan.status && plan.status.name;
    const rangeName = plan && plan.rangeName;
    const agreementId = agreement.id;
    const primaryAgreementHolderName = agreement.primaryAgreementHolder
      && agreement.primaryAgreementHolder.name;
    const staff = agreement && agreement.zone && agreement.zone.contactName;

    return (
      <Table.Row
        className="agreement-table-item"
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

AgreementTableItem.propTypes = propTypes;
AgreementTableItem.defaultProps = defaultProps;
export default withRouter(AgreementTableItem);