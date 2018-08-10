import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';
import { Status } from '../common';
import { presentNullValue, getUserFullName, getAgreementHolders, formatDateFromServer } from '../../utils';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { REFERENCE_KEY } from '../../constants/variables';
import { TYPE, STATUS, EFFECTIVE_DATE } from '../../constants/strings';

const propTypes = {
  agreement: PropTypes.shape({ plans: PropTypes.array }).isRequired,
  user: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  handleActiveIndexChange: PropTypes.func.isRequired,
  references: PropTypes.shape({}).isRequired,
  agreementsMapWithAllPlan: PropTypes.shape({}).isRequired,
  // isFetchingAgreementWithAllPlan: PropTypes.bool.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
};

export class AgreementTableItem extends Component {
  state = {
    redirectTo: null,
  }

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
          <div className="agrm__ptable__header-row__cell">{TYPE}</div>
          <div className="agrm__ptable__header-row__cell">{STATUS}</div>
          <div className="agrm__ptable__header-row__cell">
            <Button disabled>View</Button>
          </div>
        </div>

        {plans && plans.map(this.renderPlanTableItem)}
      </div>
    );
  }

  renderPlanTableItem = (plan = {}) => {
    const { references, user } = this.props;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const amendmentType = amendmentTypes.find(at => at.id === plan.amendmentTypeId);
    const amendment = amendmentType ? amendmentType.description : 'Initial Plan';
    const effectiveAt = formatDateFromServer(plan.effectiveAt, true, '-');
    return (
      <div key={plan.id} className="agrm__ptable__row">
        <div className="agrm__ptable__row__cell">
          {effectiveAt}
        </div>
        <div className="agrm__ptable__row__cell">
          {amendment}
        </div>
        <div className="agrm__ptable__row__cell">
          <Status user={user} status={plan.status} />
        </div>
        <div className="agrm__ptable__row__cell">
          <Button onClick={this.onViewClicked(plan)}>View</Button>
        </div>
      </div>
    );
  }

  onViewClicked = plan => () => {
    const { agreement } = this.props;
    this.setState({
      redirectTo: {
        push: true, // redirecting will push a new entry onto the history
        to: `${RANGE_USE_PLAN}/${agreement.id}/${plan.id}`,
      },
    });
  }

  render() {
    const { redirectTo } = this.state;
    const {
      agreement,
      isActive,
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

    if (redirectTo) {
      return <Redirect {...redirectTo} />;
    }

    return (
      <div className={classnames('agrm__table__row', { 'agrm__table__row--active': isActive })}>
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
          {this.renderPlanTable()}
        </div>
      </div>
    );
  }
}

AgreementTableItem.propTypes = propTypes;
export default AgreementTableItem;
