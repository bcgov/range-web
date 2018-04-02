import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Status } from '../common';
import { NOT_PROVIDED, NO_RUP_PROVIDED } from '../../constants/strings';
import { PRIMARY_TYPE } from '../../constants/variables';

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
    const { agreement = {} } = this.props;
    const plans = agreement.plans;
    const plan = plans[0];
    const statusName = (plan && plan.status && plan.status.name);
    const rangeName = (plan && plan.rangeName) || NO_RUP_PROVIDED;
    const agreementId = agreement.id;
    const staff = agreement.zone && agreement.zone.contactName;
    let primaryAgreementHolderName = '';
    agreement.clients && agreement.clients.forEach(client => {
      if (client.clientTypeCode === PRIMARY_TYPE) {
        primaryAgreementHolderName = client.name;
      }
    });

    return (
      <Table.Row
        className="agreement__table__item"
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