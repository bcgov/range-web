import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Status } from '../common';
import { presentNullValue, getUserfullName, getAgreementHolders } from '../../utils';

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
    const { agreement, history, index } = this.props;
    const { id: agreementId, plans } = agreement || {};
    if (agreementId && plans && plans.length !== 0) {
      const planId = plans[0].id;
      history.push(`${RANGE_USE_PLAN}/${agreementId}/${planId}`);
      this.props.onRowClicked(index, agreementId, planId);
    } else {
      alert('No range use plan found!');
    }
  }

  render() {
    const {
      plans,
      id: agreementId,
      zone,
      clients,
    } = this.props.agreement || {};

    let plan = {};
    if (plans && plans.length !== 0) {
      [plan] = plans;
    }
    const { rangeName, status } = plan;
    const user = zone && zone.user;
    const staffFullName = getUserfullName(user);
    const { primaryAgreementHolder } = getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

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
export default AgreementTableItem;
