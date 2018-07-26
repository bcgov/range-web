import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RupStaff from './RupStaff';
import RupAH from './RupAH';
import { Loading } from '../common';
import { fetchPlan, updatePlanStatus, createOrUpdateRupGrazingSchedule, toastSuccessMessage, toastErrorMessage } from '../../actionCreators';
import { updatePlan, updateGrazingSchedule } from '../../actions';
import { isUserAgreementHolder, isUserAdmin, isUserRangeOfficer } from '../../utils';
import * as selectors from '../../reducers/rootReducer';

const propTypes = {
  match: PropTypes.shape({}).isRequired,
  fetchPlan: PropTypes.func.isRequired,
  references: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  isFetchingPlan: PropTypes.bool.isRequired,
  errorFetchingPlan: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  plansMap: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  updatePlanStatus: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  updateGrazingSchedule: PropTypes.func.isRequired,
  createOrUpdateRupGrazingSchedule: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
};

const defaultProps = {
  errorFetchingPlan: null,
};

class Base extends Component {
  state = {
    agreement: null,
  }

  componentDidMount() {
    this.fetchPlan();
  }

  fetchPlan = () => {
    const { fetchPlan, match } = this.props;
    const { planId } = match.params;
    fetchPlan(planId).then((data) => {
      const { plan, ...agreement } = data;
      this.setState({
        agreement,
        planId,
      });
    });
  }

  render() {
    const {
      references,
      user,
      isFetchingPlan,
      errorFetchingPlan,
      plansMap,
      updatePlanStatus,
      updatePlan,
      pasturesMap,
      ministerIssuesMap,
      grazingSchedulesMap,
      createOrUpdateRupGrazingSchedule,
      updateGrazingSchedule,
      toastSuccessMessage,
      toastErrorMessage,
      isUpdatingStatus,
    } = this.props;
    const { agreement, planId } = this.state;
    const plan = plansMap[planId];

    return (
      <section>
        { isFetchingPlan &&
          <Loading />
        }
        { agreement && plan && isUserAdmin(user) &&
          <RupStaff
            agreement={agreement}
            references={references}
            user={user}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
            ministerIssuesMap={ministerIssuesMap}
            updatePlanStatus={updatePlanStatus}
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
            updatePlanStatus={updatePlanStatus}
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
            updatePlanStatus={updatePlanStatus}
            updateGrazingSchedule={updateGrazingSchedule}
            createOrUpdateRupGrazingSchedule={createOrUpdateRupGrazingSchedule}
            toastSuccessMessage={toastSuccessMessage}
            toastErrorMessage={toastErrorMessage}
          />
        }
        { errorFetchingPlan &&
          <Redirect to="/no-range-use-plan-found" />
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
  }
);

Base.propTypes = propTypes;
Base.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  fetchPlan,
  updatePlanStatus,
  updatePlan,
  updateGrazingSchedule,
  createOrUpdateRupGrazingSchedule,
  toastSuccessMessage,
  toastErrorMessage,
})(Base);
