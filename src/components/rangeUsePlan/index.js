import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import RupStaff from './RupStaff';
import RupAH from './RupAH';
import { Loading } from '../common';
import { planUpdated, updateGrazingSchedule, openConfirmationModal, closeConfirmationModal } from '../../actions';
import { isUserAgreementHolder, isUserAdmin, isUserRangeOfficer } from '../../utils';
import * as selectors from '../../reducers/rootReducer';
import { fetchRUP, updateRUPStatus, createOrUpdateRupGrazingSchedule, toastSuccessMessage, toastErrorMessage, createAmendment } from '../../actionCreators';

const propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ planId: PropTypes.string }) }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  history: PropTypes.shape({}).isRequired,
  fetchRUP: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
  isFetchingPlan: PropTypes.bool.isRequired,
  errorFetchingPlan: PropTypes.shape({}),
  plansMap: PropTypes.shape({}).isRequired,
};

const defaultProps = {
  errorFetchingPlan: null,
};

class Base extends Component {
  componentDidMount() {
    // initial fetch for a plan
    this.fetchPlan();
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    const locationChanged = nextProps.location !== location;

    // triggered by creating amendment
    if (locationChanged) {
      this.fetchPlan(nextProps.match.params.planId);
    }
  }

  fetchPlan = (planId) => {
    const { fetchRUP, match } = this.props;
    if (planId) {
      fetchRUP(planId);
      return;
    }
    fetchRUP(match.params.planId);
  }

  render() {
    const {
      match,
      user,
      isFetchingPlan,
      errorFetchingPlan,
      plansMap,
      history,
    } = this.props;

    const plan = plansMap[match.params.planId];
    const agreement = plan && plan.agreement;

    if (errorFetchingPlan) {
      return (
        <div className="rup__fetching-error">
          <Icon name="warning circle" size="big" color="red" />
          <div>
            <span className="rup__fetching-error__message">
              Error occured while fetching the range use plan.
            </span>
          </div>
          <div>
            <Button onClick={history.goBack}>Go Back</Button>
            <span className="rup__fetching-error__or-message">or</span>
            <Button onClick={() => this.fetchPlan()}>Retry</Button>
          </div>
        </div>
      );
    }

    return (
      <Fragment>
        <Loading active={!plan && isFetchingPlan} onlySpinner />

        { isUserAdmin(user) &&
          <RupStaff
            agreement={agreement}
            plan={plan}
            {...this.props}
          />
        }

        { isUserRangeOfficer(user) &&
          <RupStaff
            agreement={agreement}
            plan={plan}
            {...this.props}
          />
        }

        { isUserAgreementHolder(user) &&
          <RupAH
            agreement={agreement}
            plan={plan}
            fetchPlan={this.fetchPlan}
            {...this.props}
          />
        }
      </Fragment>
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
  planUpdated,
  updateGrazingSchedule,
  createOrUpdateRupGrazingSchedule,
  toastSuccessMessage,
  toastErrorMessage,
  createAmendment,
  openConfirmationModal,
  closeConfirmationModal,
})(Base);
