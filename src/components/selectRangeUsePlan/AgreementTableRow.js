import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import { Status } from '../common';
import { handleNullValue, getUserFullName, getAgreementHolders } from '../../utils';
import PlanTable from './PlanTable';

export class AgreementTableRow extends Component {
  static propTypes = {
    agreement: PropTypes.shape({ plans: PropTypes.array }).isRequired,
    user: PropTypes.shape({}).isRequired,
    index: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    handleActiveIndexChange: PropTypes.func.isRequired,
    references: PropTypes.shape({}).isRequired,
    agreementsMapWithAllPlan: PropTypes.shape({}).isRequired,
  }

  onRowClicked = () => {
    const {
      agreement,
      index,
      handleActiveIndexChange,
    } = this.props;

    if (agreement) {
      handleActiveIndexChange(index, agreement.id);
    }
  }

  render() {
    const {
      index: currIndex,
      activeIndex,
      agreement,
      user,
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
          <div className="agrm__table__accordian__cell">{handleNullValue(rangeName, false, '-')}</div>
          <div className="agrm__table__accordian__cell">{handleNullValue(primaryAgreementHolderName)}</div>
          <div className="agrm__table__accordian__cell">{handleNullValue(staffFullName)}</div>
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
          />
        </div>
      </div>
    );
  }
}

export default AgreementTableRow;
