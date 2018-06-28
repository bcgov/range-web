import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import RupAdmin from './RupAdmin';
// import RupAH from './RupAH';
import { Loading } from '../common';
// import { getRangeUsePlan } from '../../actions/agreementActions';
// import { updateRupStatus, getRupPDF, createOrUpdateRupSchedule } from '../../actions/rangeUsePlanActions';
import { fetchPlan, updateRupStatus } from '../../actionCreators';
import { updatePlan } from '../../actions';
import { getPlansMap, getReferences, getUser, getPlanIsFetching, getPasturesMap } from '../../reducers/rootReducer';
import { isUserAgreementHolder } from '../../utils';
// import { toastSuccessMessage, toastErrorMessage } from '../../actions/toastActions';
// import { PLAN_STATUS, LIVESTOCK_TYPE, MINISTER_ISSUE_TYPE, MINISTER_ISSUE_ACTION_TYPE } from '../../constants/variables';

const propTypes = {
  match: PropTypes.shape({}).isRequired,
  fetchPlan: PropTypes.func.isRequired,
  references: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  isFetchingPlan: PropTypes.bool.isRequired,
  plansMap: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  updateRupStatus: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  // agreementState: PropTypes.shape({}).isRequired,
  // isUpdatingStatus: PropTypes.bool.isRequired,
  // isDownloadingPDF: PropTypes.bool.isRequired,
  // getRupPDF: PropTypes.func.isRequired,
  // createOrUpdateRupSchedule: PropTypes.func.isRequired,
  // toastErrorMessage: PropTypes.func.isRequired,
  // toastSuccessMessage: PropTypes.func.isRequired,
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
      plansMap,
      updateRupStatus,
      updatePlan,
      pasturesMap,
      // isUpdatingStatus,
      // isDownloadingPDF,
      // updateRupStatus,
      // getRupPDF,
      // createOrUpdateRupSchedule,
      // toastErrorMessage,
      // toastSuccessMessage,
    } = this.props;
    const { agreement, planId } = this.state;
    const plan = plansMap[planId];
    // console.log(agreement, plan, zone)

    // const statuses = references[PLAN_STATUS];
    // const livestockTypes = references[LIVESTOCK_TYPE];
    // const ministerIssueTypes = references[MINISTER_ISSUE_TYPE];
    // const ministerIssueActionTypes = references[MINISTER_ISSUE_ACTION_TYPE];

    // let rup;
    // if (isUserAgreementHolder(user)) {
    //   rup = (
    //     <RupAH
    //       user={user}
    //       agreement={agreement}
    //       statuses={statuses}
    //       livestockTypes={livestockTypes}
    //       ministerIssueTypes={ministerIssueTypes}
    //       ministerIssueActionTypes={ministerIssueActionTypes}
    //       createOrUpdateRupSchedule={createOrUpdateRupSchedule}
    //       updateRupStatus={updateRupStatus}
    //       toastErrorMessage={toastErrorMessage}
    //       toastSuccessMessage={toastSuccessMessage}
    //     />
    //   );
    // } else {
    //   rup = (
    //     <Rup
    //       user={user}
    //       agreement={agreement}
    //       statuses={statuses}
    //       livestockTypes={livestockTypes}
    //       ministerIssueTypes={ministerIssueTypes}
    //       ministerIssueActionTypes={ministerIssueActionTypes}
    //       updateRupStatus={updateRupStatus}
    //       getRupPDF={getRupPDF}
    //       isUpdatingStatus={isUpdatingStatus}
    //       isDownloadingPDF={isDownloadingPDF}
    //     />
    //   );
    // }

    return (
      <div>
        { isFetchingPlan &&
          <Loading />
        }
        { plan &&
          <RupAdmin
            agreement={agreement}
            references={references}
            user={user}
            plan={plan}
            pasturesMap={pasturesMap}
            updateRupStatus={updateRupStatus}
            updatePlan={updatePlan}
          />
        }
        {/* { error &&
          <Redirect to="/no-range-use-plan-found" />
        } */}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    plansMap: getPlansMap(state),
    pasturesMap: getPasturesMap(state),
    isFetchingPlan: getPlanIsFetching(state),
    references: getReferences(state),
    user: getUser(state),
    // agreementState: state.rangeUsePlan,
    // isDownloadingPDF: state.pdf.isLoading,
    // references: state.references.data,
    // isUpdatingStatus: state.updateRupStatus.isLoading,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  fetchPlan,
  updateRupStatus,
  updatePlan,
  // getRangeUsePlan,
  // updateRupStatus,
  // getRupPDF,
  // createOrUpdateRupSchedule,
  // toastErrorMessage,
  // toastSuccessMessage,
})(Base);
