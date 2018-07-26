import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Status } from '../common';
import { presentNullValue, getUserFullName, getAgreementHolders } from '../../utils';
import { REFERENCE_KEY, PLAN_STATUS } from '../../constants/variables';

const propTypes = {
  agreement: PropTypes.shape({ plans: PropTypes.array }).isRequired,
  onRowClicked: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  // isActive: PropTypes.bool.isRequired,
};

export class AgreementTableItem extends Component {
  getLatestPlan = (plans = []) => {
    const planStatus = this.props.references[REFERENCE_KEY.PLAN_STATUS];
    const staffDraftStatus = planStatus.find(s => s.code === PLAN_STATUS.STAFF_DRAFT);
    if (!staffDraftStatus || plans.length === 0) {
      return undefined;
    }
    return plans.find(plan => plan.status.id !== staffDraftStatus.id);
  }

  onRowClicked = () => {
    const { agreement, index } = this.props;
    const plan = this.getLatestPlan(agreement.plans);

    if (plan && agreement.id) {
      this.props.onRowClicked(index, agreement.id, plan.id);
    } else {
      alert('No range use plan found!');
    }
  }

  render() {
    const {
      id: agreementId,
      zone,
      clients,
      plans,
    } = this.props.agreement || {};
    const plan = this.getLatestPlan(plans);
    const rangeName = plan && plan.rangeName;
    const status = plan && plan.status;
    const user = zone && zone.user;
    const staffFullName = getUserFullName(user);
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
