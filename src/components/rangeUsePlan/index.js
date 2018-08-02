import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RupStaff from './RupStaff';
import RupAH from './RupAH';
import { Loading } from '../common';
import { updatePlan, updateGrazingSchedule } from '../../actions';
import { isUserAgreementHolder, isUserAdmin, isUserRangeOfficer } from '../../utils';
import * as selectors from '../../reducers/rootReducer';
import { fetchRUP, updateRUPStatus, createOrUpdateRupGrazingSchedule, toastSuccessMessage, toastErrorMessage, createAmendment } from '../../actionCreators';

const propTypes = {
  match: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  fetchRUP: PropTypes.func.isRequired,
  references: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  isFetchingPlan: PropTypes.bool.isRequired,
  errorFetchingPlan: PropTypes.shape({}),
  plansMap: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  updateRUPStatus: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  updateGrazingSchedule: PropTypes.func.isRequired,
  createOrUpdateRupGrazingSchedule: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
  createAmendment: PropTypes.func.isRequired,
  isCreatingAmendment: PropTypes.bool.isRequired,
};

const defaultProps = {
  errorFetchingPlan: null,
};

class Base extends Component {
  componentDidMount() {
    // initial fetch for a plan
    this.fetchPlan(this.props.match);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    const locationChanged = nextProps.location !== location;

    // triggered by creating amendment
    if (locationChanged) {
      this.fetchPlan(nextProps.match);
    }
  }

  fetchPlan = (match) => {
    const { fetchRUP } = this.props;
    fetchRUP(match.params.planId);
  }

  render() {
    const {
      match,
      references,
      user,
      isFetchingPlan,
      errorFetchingPlan,
      plansMap,
      updateRUPStatus,
      updatePlan,
      pasturesMap,
      ministerIssuesMap,
      grazingSchedulesMap,
      createOrUpdateRupGrazingSchedule,
      updateGrazingSchedule,
      toastSuccessMessage,
      toastErrorMessage,
      isUpdatingStatus,
      createAmendment,
      isCreatingAmendment,
    } = this.props;

    const plan = plansMap[match.params.planId];
    const agreement = plan && plan.agreement;

    if (isFetchingPlan) {
      return <Loading />;
    }

    if (errorFetchingPlan) {
      return <Redirect push to="/no-rup-found-from-server" />;
    }

    return (
      <section>
        { agreement && plan && isUserAdmin(user) &&
          <RupStaff
            agreement={agreement}
            references={references}
            user={user}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
            ministerIssuesMap={ministerIssuesMap}
            updateRUPStatus={updateRUPStatus}
            updatePlan={updatePlan}
            isUpdatingStatus={isUpdatingStatus}
          />
        }

        { agreement && plan && isUserRangeOfficer(user) &&
          <RupStaff
            agreement={agreement}
            references={references}
            user={user}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
            ministerIssuesMap={ministerIssuesMap}
            updateRUPStatus={updateRUPStatus}
            updatePlan={updatePlan}
            isUpdatingStatus={isUpdatingStatus}
          />
        }

        { agreement && plan && isUserAgreementHolder(user) &&
          <RupAH
            agreement={agreement}
            references={references}
            user={user}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
            ministerIssuesMap={ministerIssuesMap}
            fetchPlan={this.fetchPlan}
            updatePlan={updatePlan}
            updateRUPStatus={updateRUPStatus}
            updateGrazingSchedule={updateGrazingSchedule}
            createOrUpdateRupGrazingSchedule={createOrUpdateRupGrazingSchedule}
            toastSuccessMessage={toastSuccessMessage}
            toastErrorMessage={toastErrorMessage}
            createAmendment={createAmendment}
            isCreatingAmendment={isCreatingAmendment}
          />
        }
      </section>
    );
  }
}

const mapStateToProps = state => (
  {
    plansMap: selectors.getPlansMap(state),
    pasturesMap: selectors.getPasturesMap(state),
    grazingSchedulesMap: selectors.getGrazingSchedulesMap(state),
    ministerIssuesMap: selectors.getMinisterIssuesMap(state),
    isFetchingPlan: selectors.getIsFetchingPlan(state),
    errorFetchingPlan: selectors.getPlanErrorMessage(state),
    references: selectors.getReferences(state),
    user: selectors.getUser(state),
    isUpdatingStatus: selectors.getIsUpdatingPlanStatus(state),
    isCreatingAmendment: selectors.getIsCreatingAmendment(state),
  }
);

Base.propTypes = propTypes;
Base.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  fetchRUP,
  updateRUPStatus,
  updatePlan,
  updateGrazingSchedule,
  createOrUpdateRupGrazingSchedule,
  toastSuccessMessage,
  toastErrorMessage,
  createAmendment,
})(Base);
