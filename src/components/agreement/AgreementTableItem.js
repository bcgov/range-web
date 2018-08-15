import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon, Button } from 'semantic-ui-react';
import { Status } from '../common';
import { presentNullValue, getUserFullName, getAgreementHolders } from '../../utils';
import { TYPE, STATUS, EFFECTIVE_DATE, SUBMITTED } from '../../constants/strings';
import PlanTable from './PlanTable';

const propTypes = {
  agreement: PropTypes.shape({ plans: PropTypes.array }).isRequired,
  user: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.bool.isRequired,
  handleActiveIndexChange: PropTypes.func.isRequired,
  references: PropTypes.shape({}).isRequired,
  agreementsMapWithAllPlan: PropTypes.shape({}).isRequired,
  // isFetchingAgreementWithAllPlan: PropTypes.bool.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
};

export class AgreementTableItem extends Component {
  onRowClicked = () => {
    const {
      agreement,
      index,
      handleActiveIndexChange,
      toastErrorMessage,
    } = this.props;
    const [plan] = agreement.plans;

    if (plan && agreement) {
      handleActiveIndexChange(index, agreement.id);
    } else {
      toastErrorMessage('No range use plan found!');
    }
  }

  renderPlanTable = () => {
    const { agreementsMapWithAllPlan, agreement } = this.props;
    const { plans } = agreementsMapWithAllPlan[agreement.id] || {};

    return (
      <div className="agrm__ptable">
        <div className="agrm__ptable__header-row">
          <div className="agrm__ptable__header-row__cell">{EFFECTIVE_DATE}</div>
          <div className="agrm__ptable__header-row__cell">{SUBMITTED}</div>
          <div className="agrm__ptable__header-row__cell">{TYPE}</div>
          <div className="agrm__ptable__header-row__cell">{STATUS}</div>
          <div className="agrm__ptable__header-row__cell">
            <Button disabled>View</Button>
          </div>
        </div>
        {this.renderPlanTableItems(plans)}
      </div>
    );
  }

  render() {
    const {
      index: currIndex,
      activeIndex,
      agreement,
      user,
      agreementsMapWithAllPlan,
      references,
    } = this.props;
    const {
      id: agreementId,
      zone,
      clients,
      plans,
    } = agreement || {};

    // the most recent plan without Wrongly made without effect
    const [mostCurrPlan] = plans;
    const rangeName = mostCurrPlan && mostCurrPlan.rangeName;
    const status = mostCurrPlan && mostCurrPlan.status;
    const staff = zone && zone.user;
    const staffFullName = getUserFullName(staff);
    const { primaryAgreementHolder } = getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;
    const isActive = activeIndex === currIndex;
    const className = classnames('agrm__table__row', {
      'agrm__table__row--active': isActive,
      'agrm__table__row--not-active': (activeIndex >= 0 && !isActive),
    });

    return (
      <div className={className}>
        <button
          className="agrm__table__accordian"
          onClick={this.onRowClicked}
        >
          <div className="agrm__table__accordian__cell">{agreementId}</div>
          <div className="agrm__table__accordian__cell">{presentNullValue(rangeName)}</div>
          <div className="agrm__table__accordian__cell">{presentNullValue(primaryAgreementHolderName)}</div>
          <div className="agrm__table__accordian__cell">{presentNullValue(staffFullName)}</div>
          <div className="agrm__table__accordian__cell">
            <Status user={user} status={status} />
          </div>
          <div className="agrm__table__accordian__cell">
            { isActive &&
              <Icon name="minus square" />
            }
            { !isActive &&
              <Icon name="plus square" />
            }
          </div>
        </button>
        <div className={classnames('agrm__table__panel', { 'agrm__table__panel--active': isActive })}>
          <PlanTable
            agreement={agreement}
            agreementsMapWithAllPlan={agreementsMapWithAllPlan}
            references={references}
            user={user}
          />
        </div>
      </div>
    );
  }
}

AgreementTableItem.propTypes = propTypes;
export default AgreementTableItem;
