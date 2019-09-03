import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Loading, PrimaryButton } from '../common'
import {
  planUpdated,
  pastureAdded,
  pastureUpdated,
  pastureCopied,
  grazingScheduleUpdated,
  openConfirmationModal
} from '../../actions'
import {
  isUserAgreementHolder,
  isUserAdmin,
  isUserRangeOfficer
} from '../../utils'
import * as selectors from '../../reducers/rootReducer'
import { DETAIL_RUP_TITLE } from '../../constants/strings'
import PageForStaff from './pageForStaff'
import PageForAH from './pageForAH'
import {
  fetchRUP,
  updateRUP,
  updateRUPStatus,
  createOrUpdateRUPPasture,
  createOrUpdateRUPGrazingSchedule,
  toastSuccessMessage,
  toastErrorMessage,
  createAmendment,
  createOrUpdateRUPMinisterIssueAndActions,
  createOrUpdateRUPInvasivePlantChecklist,
  createOrUpdateRUPManagementConsideration,
  createRUPPlantCommunityAndOthers
} from '../../actionCreators'

class Base extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ planId: PropTypes.string })
    }).isRequired,
    user: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
    fetchRUP: PropTypes.func.isRequired,
    isFetchingPlan: PropTypes.bool.isRequired,
    errorFetchingPlan: PropTypes.bool.isRequired,
    plansMap: PropTypes.shape({}).isRequired,
    reAuthRequired: PropTypes.bool.isRequired
  }

  componentWillMount() {
    document.title = DETAIL_RUP_TITLE
  }

  componentDidMount() {
    // initial fetch for a plan
    this.fetchPlan()
  }

  componentWillReceiveProps(nextProps) {
    const { reAuthRequired, errorFetchingPlan } = nextProps

    // fetch zones and users if the user just reauthenticate and there was an error occurred
    const justReAuthenticated =
      this.props.reAuthRequired === true && reAuthRequired === false
    if (justReAuthenticated && errorFetchingPlan) {
      this.fetchPlan()
    }
  }

  getPlanId = () => {
    const { match, location } = this.props
    // the second part is being used for testing
    return (
      match.params.planId || location.pathname.charAt('/range-use-plan/'.length)
    )
  }

  fetchPlan = () => {
    const planId = this.getPlanId()
    return this.props.fetchRUP(planId)
  }

  render() {
    const {
      user,
      isFetchingPlan,
      errorFetchingPlan,
      plansMap,
      history
    } = this.props

    const planId = this.getPlanId()
    const plan = plansMap[planId]
    const agreement = plan && plan.agreement
    const isFetchingPlanForTheFirstTime = !plan && isFetchingPlan
    // const doneFetching = !isFetchingPlanForTheFirstTime;

    if (errorFetchingPlan) {
      return (
        <div className="rup__fetching-error">
          <Icon name="warning sign" size="large" color="red" />
          <div>
            <span className="rup__fetching-error__message">
              Error occurred while fetching the range use plan.
            </span>
          </div>
          <div>
            <PrimaryButton inverted onClick={history.goBack}>
              Go Back
            </PrimaryButton>
            <span className="rup__fetching-error__or-message">or</span>
            <PrimaryButton onClick={this.fetchPlan} content="Retry" />
          </div>
        </div>
      )
    }

    return (
      <Fragment>
        <Loading active={isFetchingPlanForTheFirstTime} onlySpinner />

        {!plan && !isFetchingPlan && (
          <div className="rup__no-plan-shown">
            {"Don't see any plan?"}
            <PrimaryButton
              onClick={this.fetchPlan}
              content="Fetch Plan"
              style={{ marginLeft: '15px' }}
            />
          </div>
        )}

        {plan && isUserAdmin(user) && (
          <PageForStaff
            {...this.props}
            agreement={agreement}
            plan={plan}
            fetchPlan={this.fetchPlan}
          />
        )}

        {plan && isUserRangeOfficer(user) && (
          <PageForStaff
            {...this.props}
            agreement={agreement}
            plan={plan}
            fetchPlan={this.fetchPlan}
          />
        )}

        {plan && isUserAgreementHolder(user) && (
          <PageForAH
            {...this.props}
            agreement={agreement}
            plan={plan}
            fetchPlan={this.fetchPlan}
          />
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  plansMap: selectors.getPlansMap(state),
  pasturesMap: selectors.getPasturesMap(state),
  plantCommunitiesMap: selectors.getPlantCommunitiesMap(state),
  grazingSchedulesMap: selectors.getGrazingSchedulesMap(state),
  ministerIssuesMap: selectors.getMinisterIssuesMap(state),
  confirmationsMap: selectors.getConfirmationsMap(state),
  planStatusHistoryMap: selectors.getPlanStatusHistoryMap(state),
  additionalRequirementsMap: selectors.getAdditionalRequirementsMap(state),
  managementConsiderationsMap: selectors.getManagementConsiderationsMap(state),
  isFetchingPlan: selectors.getIsFetchingPlan(state),
  errorFetchingPlan: selectors.getPlanErrorOccured(state),
  references: selectors.getReferences(state),
  isUpdatingStatus: selectors.getIsUpdatingPlanStatus(state),
  isCreatingAmendment: selectors.getIsCreatingAmendment(state),
  reAuthRequired: selectors.getReAuthRequired(state)
})

export default connect(
  mapStateToProps,
  {
    fetchRUP,
    updateRUP,
    updateRUPStatus,
    planUpdated,
    pastureAdded,
    pastureUpdated,
    pastureCopied,
    createOrUpdateRUPPasture,
    grazingScheduleUpdated,
    createOrUpdateRUPGrazingSchedule,
    toastSuccessMessage,
    toastErrorMessage,
    createAmendment,
    openConfirmationModal,
    createOrUpdateRUPMinisterIssueAndActions,
    createOrUpdateRUPInvasivePlantChecklist,
    createOrUpdateRUPManagementConsideration,
    createRUPPlantCommunityAndOthers
  }
)(Base)
