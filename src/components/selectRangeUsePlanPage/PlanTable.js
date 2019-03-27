import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Segment } from 'semantic-ui-react';
import { isStatusAmongApprovedStatuses } from '../../utils';
import { Loading, PrimaryButton } from '../common';
import { EFFECTIVE_DATE, SUBMITTED, TYPE, STATUS, VIEW, NO_RESULTS_FOUND, ERROR_OCCUR } from '../../constants/strings';
import { getIsFetchingAgreements, getUser, getReferences, getIsFetchingAgreementWithAllPlan, getAgreementsMapWithAllPlan, getAgreementsMapWithAllPlanErrorOccured } from '../../reducers/rootReducer';
import PlanTableRow from './PlanTableRow';

class PlanTable extends Component {
  static propTypes = {
    agreementsMapWithAllPlan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    isFetchingAgreementWithAllPlan: PropTypes.bool.isRequired,
    isFetchingAgreements: PropTypes.bool.isRequired,
    errorGettingAgreementWithAllPlan: PropTypes.bool.isRequired,
    agreement: PropTypes.shape({}).isRequired,
  }

  renderPlanTableItems = (plans = []) => {
    const {
      errorGettingAgreementWithAllPlan,
      isFetchingAgreementWithAllPlan,
      references,
      user,
    } = this.props;

    let approvedFound = false;
    if (errorGettingAgreementWithAllPlan) {
      return (
        <div className="agrm__ptable__message agrm__ptable__message--error">
          {ERROR_OCCUR}
          <PrimaryButton
            inverted
            onClick={() => window.location.reload()}
            style={{ marginLeft: '10px' }}
          >
            Refresh
          </PrimaryButton>
        </div>
      );
    }
    if (!isFetchingAgreementWithAllPlan && plans.length === 0) {
      return (
        <div className="agrm__ptable__message">
          {NO_RESULTS_FOUND}
        </div>
      );
    }

    return plans.map((p) => {
      const plan = { ...p };

      if (!approvedFound && isStatusAmongApprovedStatuses(plan.status)) {
        approvedFound = true;
        plan.recentApproved = true;
      }

      return (
        <PlanTableRow
          key={plan.id}
          plan={plan}
          references={references}
          user={user}
        />
      );
    });
  }

  render() {
    const {
      agreementsMapWithAllPlan,
      agreement,
      isFetchingAgreementWithAllPlan,
      isFetchingAgreements,
    } = this.props;
    const { plans } = agreementsMapWithAllPlan[agreement.id] || {};
    const isOnlyFetchingAgreementWithAllPlan = isFetchingAgreementWithAllPlan && !isFetchingAgreements;

    return (
      <Segment basic>
        <Loading size="medium" active={isOnlyFetchingAgreementWithAllPlan} />

        <div className="agrm__ptable">
          <div className="agrm__ptable__header-row">
            <div className="agrm__ptable__header-row__cell">{EFFECTIVE_DATE}</div>
            <div className="agrm__ptable__header-row__cell">{SUBMITTED}</div>
            <div className="agrm__ptable__header-row__cell">{TYPE}</div>
            <div className="agrm__ptable__header-row__cell">{STATUS}</div>
            <div className="agrm__ptable__header-row__cell">
              <Button disabled>{VIEW}</Button>
            </div>
          </div>
          {this.renderPlanTableItems(plans)}
        </div>
      </Segment>
    );
  }
}

const mapStateToProps = state => (
  {
    isFetchingAgreements: getIsFetchingAgreements(state),
    user: getUser(state),
    references: getReferences(state),
    isFetchingAgreementWithAllPlan: getIsFetchingAgreementWithAllPlan(state),
    agreementsMapWithAllPlan: getAgreementsMapWithAllPlan(state),
    errorGettingAgreementWithAllPlan: getAgreementsMapWithAllPlanErrorOccured(state),
  }
);

export default connect(mapStateToProps, null)(PlanTable);
