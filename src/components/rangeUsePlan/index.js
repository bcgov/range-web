import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RupAdmin from './RupAdmin';
import RupAH from './RupAH';
// import RupAH from './RupAH';
import { Loading } from '../common';
// import { getRangeUsePlan } from '../../actions/agreementActions';
// import { updatePlanStatus, getRupPDF, createOrUpdateRupSchedule } from '../../actions/rangeUsePlanActions';
import { fetchPlan, updatePlanStatus } from '../../actionCreators';
import { updatePlan } from '../../actions';
import {
  getPlansMap, getReferences, getUser,
  getPlanIsFetching, getPasturesMap, getGrazingSchedulesMap,
  getMinisterIssuesMap, getGrazingScheduleEntriesMap, getPlanErrorMessage,
} from '../../reducers/rootReducer';
import { isUserAgreementHolder, isUserAdmin } from '../../utils';
// import { toastSuccessMessage, toastErrorMessage } from '../../actions/toastActions';

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
  grazingScheduleEntriesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  updatePlanStatus: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  // agreementState: PropTypes.shape({}).isRequired,
  // isUpdatingStatus: PropTypes.bool.isRequired,
  // isDownloadingPDF: PropTypes.bool.isRequired,
  // createOrUpdateRupSchedule: PropTypes.func.isRequired,
  // toastErrorMessage: PropTypes.func.isRequired,
  // toastSuccessMessage: PropTypes.func.isRequired,
};
const defaultProps = {
  errorFetchingPlan: null,
};
class Base extends Component {
  state = {
    agreement: null,
  }

  componentDidMount() {
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
      grazingScheduleEntriesMap,
      // isUpdatingStatus,
      // isDownloadingPDF,
      // updatePlanStatus,
      // getRupPDF,
      // createOrUpdateRupSchedule,
      // toastErrorMessage,
      // toastSuccessMessage,
    } = this.props;
    const { agreement, planId } = this.state;
    const plan = plansMap[planId];
    // console.log(agreement, plan)

    return (
      <div>
        { isFetchingPlan &&
          <Loading />
        }
        { agreement && plan && isUserAdmin(user) &&
          <RupAdmin
            agreement={agreement}
            references={references}
            user={user}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
            grazingScheduleEntriesMap={grazingScheduleEntriesMap}
            ministerIssuesMap={ministerIssuesMap}
            updatePlanStatus={updatePlanStatus}
            updatePlan={updatePlan}
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
            grazingScheduleEntriesMap={grazingScheduleEntriesMap}
            ministerIssuesMap={ministerIssuesMap}
            updatePlanStatus={updatePlanStatus}
            updatePlan={updatePlan}
          />
        }
        { errorFetchingPlan &&
          <Redirect to="/no-range-use-plan-found" />
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    plansMap: getPlansMap(state),
    pasturesMap: getPasturesMap(state),
    grazingSchedulesMap: getGrazingSchedulesMap(state),
    grazingScheduleEntriesMap: getGrazingScheduleEntriesMap(state),
    ministerIssuesMap: getMinisterIssuesMap(state),
    isFetchingPlan: getPlanIsFetching(state),
    errorFetchingPlan: getPlanErrorMessage(state),
    references: getReferences(state),
    user: getUser(state),
    // agreementState: state.rangeUsePlan,
    // isDownloadingPDF: state.pdf.isLoading,
    // references: state.references.data,
    // isUpdatingStatus: state.updatePlanStatus.isLoading,
  }
);

Base.propTypes = propTypes;
Base.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  fetchPlan,
  updatePlanStatus,
  updatePlan,
  // getRangeUsePlan,
  // updatePlanStatus,
  // getRupPDF,
  // createOrUpdateRupSchedule,
  // toastErrorMessage,
  // toastSuccessMessage,
})(Base);
