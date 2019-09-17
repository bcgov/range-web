import React, { Fragment, useState, useEffect } from 'react'
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
  createOrUpdateRUPManagementConsideration
} from '../../actionCreators'
import * as API from '../../constants/api'
import { Form } from 'formik-semantic-ui'
import { useToast } from '../../providers/ToastProvider'
import { useReferences } from '../../providers/ReferencesProvider'
import RUPSchema from './schema'

const Base = ({
  user,
  plansMap,
  history,
  fetchRUP,
  match,
  location,
  ...props
}) => {
  const [isFetchingPlan, setFetching] = useState(false)
  const [errorFetchingPlan, setError] = useState()
  const [plan, setPlan] = useState()

  const references = useReferences()

  const { successToast, errorToast } = useToast()

  const getPlanId = () =>
    match.params.planId || location.pathname.charAt('/range-use-plan/'.length)

  const fetchPlan = async () => {
    setFetching(true)
    const planId = getPlanId()

    try {
      const { data } = await axios.get(
        API.GET_RUP(planId),
        getAuthHeaderConfig()
      )
      setPlan(RUPSchema.cast(data))
    } catch (e) {
      setError(e)
    }

    setFetching(false)

    return fetchRUP(planId)
  }

  useEffect(() => {
    fetchPlan()
  }, [])

  const handleSubmit = async (plan, formik) => {
    const {
      pastures,
      grazingSchedules,
      invasivePlantChecklist,
      managementConsiderations,
      additionalRequirements
    } = plan

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
              return Promise.resolve()
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
        const { id, ...values } = invasivePlantChecklist
        await axios.post(
          API.CREATE_RUP_INVASIVE_PLANT_CHECKLIST(plan.id),
          values,
          config
        )
      }

      await Promise.all(
        managementConsiderations.map(consideration => {
          if (uuid.isUUID(consideration.id)) {
            const { id, ...values } = consideration
            return axios.post(
              API.CREATE_RUP_MANAGEMENT_CONSIDERATION(plan.id),
              values,
              config
            )
          } else {
            return axios.put(
              API.UPDATE_RUP_MANAGEMENT_CONSIDERATION(
                plan.id,
                consideration.id
              ),
              consideration,
              config
            )
          }
        })
      )

      await Promise.all(
        additionalRequirements.map(requirement => {
          if (uuid.isUUID(requirement.id)) {
            const { id, ...values } = requirement
            return axios.post(
              API.CREATE_RUP_ADDITIONAL_REQUIREMENT(plan.id),
              values,
              config
            )
          }
        })
      )

      formik.setSubmitting(false)
      successToast('Successfully saved draft')
    } catch (err) {
      formik.setStatus('error')
      formik.setSubmitting(false)
      errorToast('Error saving draft')
      throw err
    }
  }

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
          <PrimaryButton onClick={fetchPlan} content="Retry" />
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
            onClick={fetchPlan}
            content="Fetch Plan"
            style={{ marginLeft: '15px' }}
          />
        </div>
      )}

      {plan && (
        <Form
          initialValues={plan}
          validateOnChange={true}
          validationSchema={RUPSchema}
          onSubmit={handleSubmit}
          render={({ values: plan }) => (
            <>
              {(isUserAdmin(user) || isUserRangeOfficer(user)) && (
                <PageForStaff
                  references={references}
                  agreement={agreement}
                  plan={plan}
                  fetchPlan={fetchPlan}
                  user={user}
                  history={history}
                  {...props}
                />
              )}

              {isUserAgreementHolder(user) && (
                <PageForAH
                  references={references}
                  agreement={agreement}
                  plan={plan}
                  fetchPlan={fetchPlan}
                  user={user}
                  history={history}
                  {...props}
                />
              )}
            </>
          )}
        />
      )}
    </Fragment>
  )
}

Base.propTypes = {
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

const mapStateToProps = state => ({
  plansMap: selectors.getPlansMap(state),
  pasturesMap: selectors.getPasturesMap(state),
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
    createOrUpdateRUPManagementConsideration
  }
)(Base)
