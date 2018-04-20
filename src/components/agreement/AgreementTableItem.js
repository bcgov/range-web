import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Status } from '../common';
import { NO_RUP_PROVIDED } from '../../constants/strings';
import { PRIMARY_TYPE } from '../../constants/variables';
import { presentNullValue } from '../../handlers';

const propTypes = {
  agreement: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export class AgreementTableItem extends Component {
  onRowClicked = () => {
    const { agreement, history } = this.props;
    if (agreement && agreement.plans.length !== 0) {
      history.push(`${RANGE_USE_PLAN}/${agreement.id}/${agreement.plans[0].id}`);
    } else {
      alert('No range use plan found!');
    }
  }

  getPrimaryAgreementHolder = (clients = []) => {
    let primaryAgreementHolder = {};
    clients.forEach((client) => {
      if (client.clientTypeCode === PRIMARY_TYPE) {
        primaryAgreementHolder = client;
      }
    });

    return primaryAgreementHolder;
  }

  render() {
    const { agreement = {} } = this.props;
    const { plans, id: agreementId, zone = {} } = agreement;
    const staffName = zone.user && `${zone.user.givenName} ${zone.user.familyName}`;
    const { name: primaryAgreementHolderName } = this.getPrimaryAgreementHolder(agreement.clients);
    const plan = plans[0] || {};
    const statusName = plan.status && plan.status.name;
    const { rangeName } = plan;

    return (
      <Table.Row
        className="agreement__table__item"
        onClick={this.onRowClicked}
      >
        <Table.Cell>{agreementId}</Table.Cell>
        <Table.Cell>{presentNullValue(rangeName)}</Table.Cell>
        <Table.Cell>{presentNullValue(primaryAgreementHolderName)}</Table.Cell>
        <Table.Cell>{presentNullValue(staffName)}</Table.Cell>
        <Table.Cell><Status status={statusName} /></Table.Cell>
      </Table.Row>
    );
  }
}

AgreementTableItem.propTypes = propTypes;
export default withRouter(AgreementTableItem);
