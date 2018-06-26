import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Status } from '../common';
import { CLIENT_TYPE } from '../../constants/variables';
import { presentNullValue, getUserfullName } from '../../utils';

const propTypes = {
  agreement: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  onRowClicked: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  user: PropTypes.shape({}).isRequired,
  // isActive: PropTypes.bool.isRequired,
};

export class AgreementTableItem extends Component {
  onRowClicked = () => {
    const { agreement = {}, history, index } = this.props;
    const { id: agreementId, plans } = agreement;
    if (agreementId && plans && plans.length !== 0) {
      const planId = plans[0].id;
      history.push(`${RANGE_USE_PLAN}/${agreementId}/${planId}`);
      this.props.onRowClicked(index, agreementId, planId);
    } else {
      alert('No range use plan found!');
    }
  }

  getPrimaryAgreementHolder = (clients = []) => {
    let primaryAgreementHolder = {};
    clients.forEach((client) => {
      if (client.clientTypeCode === CLIENT_TYPE.PRIMARY) {
        primaryAgreementHolder = client;
      }
    });

    return primaryAgreementHolder;
  }

  render() {
    const { agreement } = this.props;
    const { plans, id: agreementId, zone } = agreement || {};
    const plan = plans[0];

    const user = zone && zone.user;
    const staffFullName = getUserfullName(user);
    const { name: primaryAgreementHolderName } = this.getPrimaryAgreementHolder(agreement.clients);
    const { rangeName, status } = plan || {};

    return (
      <Table.Row
        className="agreement__table__item"
        onClick={this.onRowClicked}
      >
        <Table.Cell>{agreementId}</Table.Cell>
        <Table.Cell>{presentNullValue(rangeName)}</Table.Cell>
        <Table.Cell>{presentNullValue(primaryAgreementHolderName)}</Table.Cell>
        <Table.Cell>{presentNullValue(staffFullName)}</Table.Cell>
        <Table.Cell>
          <Status user={this.props.user} status={status} />
        </Table.Cell>
      </Table.Row>
    );
  }
}

AgreementTableItem.propTypes = propTypes;
export default withRouter(AgreementTableItem);
