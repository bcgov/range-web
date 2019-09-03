import React, { Component, Fragment } from 'react'
import uuid from 'uuid-v4'
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
  isUserRangeOfficer,
  axios,
  getAuthHeaderConfig
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
import * as API from '../../constants/api'
import { Form } from 'formik-semantic-ui'

class Base extends Component {
  state = {
    plan: null,
    isFetching: false
  }

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

  fetchPlan = async () => {
    this.setState({
      isFetching: true
    })
    const planId = this.getPlanId()

    const { data } = await axios.get(API.GET_RUP(planId), getAuthHeaderConfig())

    this.setState({
      plan: data
    })

    console.log(data)

    this.setState({
      isFetching: false
    })

    return this.props.fetchRUP(planId)
  }

  handleSubmit = async (plan, formik) => {
    const { pastures, grazingSchedules, invasivePlantChecklist } = plan

    console.log('submitting')

    const config = getAuthHeaderConfig()

    try {
      // Update Plan
      await axios.put(API.UPDATE_RUP(plan.id), plan, config)

      const pasturesData = await Promise.all(
        pastures.map(pasture => {
          if (Number.isInteger(pasture.id)) {
            return axios.put(
              API.UPDATE_RUP_PASTURE(plan.id, pasture.id),
              pasture,
              config
            )
          } else {
            const { id, ...values } = pasture
            return axios.post(API.CREATE_RUP_PASTURE(plan.id), values, config)
          }
        })
      )

      const newPastures = pasturesData.map(p => p.data)

      await Promise.all(
        pastures.map((pasture, pastureIndex) =>
          Promise.all(
            pasture.plantCommunities.map(plantCommunity => {
              const { id, ...values } = plantCommunity
              if (!Number.isInteger(id)) {
                return axios.post(
                  API.CREATE_RUP_PLANT_COMMUNITY(
                    plan.id,
                    newPastures[pastureIndex].id
                  ),
                  values,
                  config
                )
              }
            })
          )
        )
      )

      // Update Grazing Schedules
      await Promise.all(
        grazingSchedules.map(schedule => {
          if (uuid.isUUID(schedule.id)) {
            const { id, ...grazingSchedule } = schedule
            return axios.post(
              API.CREATE_RUP_GRAZING_SCHEDULE(plan.id),
              { ...grazingSchedule, plan_id: plan.id },
              config
            )
          } else {
            return axios.put(
              API.UPDATE_RUP_GRAZING_SCHEDULE(plan.id, schedule.id),
              { ...schedule },
              config
            )
          }
        })
      )

      if (invasivePlantChecklist && invasivePlantChecklist.id) {
        await axios.put(
          API.UPDATE_RUP_INVASIVE_PLANT_CHECKLIST(
            plan.id,
            invasivePlantChecklist.id
          ),
          invasivePlantChecklist,
          config
        )
      } else {
        await axios.post(
          API.CREATE_RUP_INVASIVE_PLANT_CHECKLIST(plan.id),
          invasivePlantChecklist,
          config
        )
      }

      formik.setSubmitting(false)
    } catch (err) {
      formik.setStatus('error')
      formik.setSubmitting(false)
      toastErrorMessage(err)
      throw err
    }
  }

  render() {
    const { user, errorFetchingPlan, plansMap, history } = this.props

    const isFetchingPlan = this.state.isFetching

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

        {this.state.plan && (
          <Form
            initialValues={this.state.plan}
            validateOnChange={true}
            onSubmit={this.handleSubmit}
            render={({ values: plan }) => (
              <>
                {(isUserAdmin(user) || isUserRangeOfficer(user)) && (
                  <PageForStaff
                    {...this.props}
                    agreement={agreement}
                    plan={plan}
                    fetchPlan={this.fetchPlan}
                  />
                )}

                {isUserAgreementHolder(user) && (
                  <PageForAH
                    {...this.props}
                    agreement={agreement}
                    plan={plan}
                    fetchPlan={this.fetchPlan}
                  />
                )}
              </>
            )}
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
