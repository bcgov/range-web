import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import { Status } from '../common';
import { presentNullValue, getUserFullName, getAgreementHolders } from '../../utils';

const propTypes = {
  agreement: PropTypes.shape({ plans: PropTypes.array }).isRequired,
  user: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onRowClicked: PropTypes.func.isRequired,
  fetchAgreement: PropTypes.func.isRequired,
};

export class AgreementTableItem extends Component {
  state = {
    wholePlans: [],
  }

  onRowClicked = () => {
    const {
      agreement,
      index,
      activeIndex,
      onRowClicked,
      fetchAgreement,
    } = this.props;
    const [plan] = agreement.plans;

    if (plan && agreement) {
      onRowClicked(index);

      if (activeIndex !== index) {
        this.setState({ wholePlans: [] });
        // fetch agreements when this row becomes active
        fetchAgreement(agreement.id).then((agreement) => {
          this.setState({ wholePlans: agreement.plans });
        });
      }
    } else {
      alert('No range use plan found!');
    }
  }

  render() {
    const { wholePlans } = this.state;
    const {
      agreement,
      activeIndex,
      index,
      user,
    } = this.props;
    const {
      id: agreementId,
      zone,
      clients,
      plans,
    } = agreement || {};

    const [plan] = plans;
    const rangeName = plan && plan.rangeName;
    const status = plan && plan.status;
    const staff = zone && zone.user;
    const staffFullName = getUserFullName(staff);
    const { primaryAgreementHolder } = getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;
    const isActive = activeIndex === index;

    return (
      <div className={classnames('agreement__table__row', { 'agreement__table__row--active': isActive })}>
        <button
          className="agreement__table__accordian"
          onClick={this.onRowClicked}
        >
          <div className="agreement__table__accordian__cell">{agreementId}</div>
          <div className="agreement__table__accordian__cell">{presentNullValue(rangeName)}</div>
          <div className="agreement__table__accordian__cell">{presentNullValue(primaryAgreementHolderName)}</div>
          <div className="agreement__table__accordian__cell">{presentNullValue(staffFullName)}</div>
          <div className="agreement__table__accordian__cell">
            <Status user={user} status={status} />
          </div>
          <div className="agreement__table__accordian__cell">
            { isActive &&
              <Icon name="times circle outline" />
            }
            { !isActive &&
              <Icon name="plus circle" />
            }
          </div>
        </button>
        <div className={classnames('agreement__table__panel', { 'agreement__table__panel--active': isActive })}>
          {wholePlans.map(plan => <pre key={plan.id}>{JSON.stringify(plan)}</pre>)}
        </div>
      </div>
    );
  }
}

AgreementTableItem.propTypes = propTypes;
export default AgreementTableItem;
