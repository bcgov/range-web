import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Modal, Header, Button } from 'semantic-ui-react'
import { Route, Prompt } from 'react-router-dom'
import { startCase } from 'lodash'
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
  getFirstFormikError
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
import { Form } from 'formik-semantic-ui'
import { useToast } from '../../providers/ToastProvider'
import { useReferences } from '../../providers/ReferencesProvider'
import RUPSchema from './schema'
import OnSubmitValidationError from '../common/form/OnSubmitValidationError'
import PDFView from './pdf/PDFView'
import { RANGE_USE_PLAN } from '../../constants/routes'
import { getIn } from 'formik'
import { useCurrentPlan } from '../../providers/PlanProvider'

const Base = ({
  user,
  plansMap,
  history,
  fetchRUP,
  match,
  location,
  ...props
}) => {
  const {
    setCurrentPlanId,
    currentPlan,
    clientAgreements,
    currentPlanId,
    fetchPlan,
    isFetchingPlan,
    errorFetchingPlan,
    savePlan
  } = useCurrentPlan()

  const references = useReferences()

  const { successToast, errorToast } = useToast()

  const planId =
    match.params.planId || location.pathname.charAt('/range-use-plan/'.length)

  useEffect(() => {
    setCurrentPlanId(planId)
  }, [planId])

  useEffect(() => {
    // Hard refetch plan when RUP page is navigated back to, to ensure no stale
    // data
    fetchPlan(planId, true)
  }, [location.pathname])

  const handleValidationError = formik => {
    // Get the first field path in the formik errors object
    const [errorPathString, error] = getFirstFormikError(formik.errors)

    /**
     * Convert a field "path" in the form of
     *
     * 'pastures.0.plantCommunities.3.notes'
     *
     * into something more human-usable like:
     *
     * ['Pastures: My Pasture', 'Plant Communities: 3', 'Notes: Required field']
     *
     * By doing a lookup in `formik.values` based on the error path, by iterating
     * through ever-increasing chunks of the path. ie.
     * ['pastures', 'pastures.0', 'pastures.0.plantCommunities', ...]
     */
    const errorPath = errorPathString
      .split('.')
      .reduce((acc, value, i, paths) => {
        // Get previous chunk of path based on index
        const path = paths.slice(0, i + 1).join('.')
        const parentKey = paths[i - 1]

        if (!isNaN(parseFloat(value))) {
          const object = getIn(formik.values, path)
          return [...acc, `${startCase(parentKey)}: ${object.name || value}`]
        }

        if (i === paths.length - 1) {
          return [...acc, `${startCase(value)}: ${error}`]
        }

        return acc
      }, [])

    // Add "RUP" to the beginning of the error message
    const formattedPath = ['RUP'].concat(errorPath)

    errorToast(`Could not submit due to invalid fields.\n\n`, {
      timeout: 5000,
      content: (
        <code>
          {formattedPath.map((line, i) => (
            <div
              key={i}
              style={{ marginLeft: i * 20, fontFamily: 'monospace' }}>
              &gt; {line}
            </div>
          ))}
        </code>
      )
    })
  }

  const handleSubmit = async (plan, formik) => {
    try {
      // Update Plan
      const planId = await savePlan(plan)

      formik.setSubmitting(false)
      successToast('Successfully saved draft')

      await history.replace(`${RANGE_USE_PLAN}/${planId}`, {
        saved: true
      })
    } catch (err) {
      formik.setStatus('error')
      formik.setSubmitting(false)
      errorToast('Error saving draft')
      throw err
    }
  }

  const agreement = currentPlan && currentPlan.agreement
  const isFetchingPlanForTheFirstTime = !currentPlan && isFetchingPlan
  // const doneFetching = !isFetchingPlanForTheFirstTime;

  if (errorFetchingPlan && !isFetchingPlan) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(errorFetchingPlan)
    }
    return (
      <div className="rup__fetching-error">
        <Icon name="warning sign" size="large" color="red" />
        <div>
          <span className="rup__fetching-error__message">
            Error occurred while fetching the range use plan.
          </span>
        </div>
        {process.env.NODE_ENV !== 'production' && (
          <p>Check console for details.</p>
        )}
        <div>
          <PrimaryButton inverted onClick={history.goBack}>
            Go Back
          </PrimaryButton>
          <span className="rup__fetching-error__or-message">or</span>
          <PrimaryButton
            onClick={() => fetchPlan(currentPlanId, true)}
            content="Retry"
          />
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <Loading active={isFetchingPlanForTheFirstTime} onlySpinner />

      <Route
        path={`${match.url}/export-pdf`}
        render={() => {
          const closePDFModal = () => history.push(match.url)
          return (
            <Modal
              size="tiny"
              open={true}
              onClose={closePDFModal}
              dimmer="blurring">
              <Header content="Download PDF" icon="file pdf" />
              <Modal.Content>
                The PDF may take a few minutes to generate.
              </Modal.Content>
              <Modal.Actions>
                <Button type="button" onClick={closePDFModal}>
                  Close
                </Button>
                <PDFView match={match} />
              </Modal.Actions>
            </Modal>
          )
        }}
      />

      {currentPlan && (
        <Form
          initialValues={currentPlan}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={RUPSchema}
          onSubmit={handleSubmit}
          render={({ values: plan, dirty }) => (
            <>
              <Prompt
                when={dirty}
                message={location => {
                  return (
                    (location.state && location.state.saved) ||
                    'This RUP has unsaved changes that will be lost if you leave this page.'
                  )
                }}
              />
              <OnSubmitValidationError callback={handleValidationError} />

              {(isUserAdmin(user) || isUserRangeOfficer(user)) && (
                <PageForStaff
                  references={references}
                  agreement={agreement}
                  plan={plan}
                  clientAgreements={clientAgreements}
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
                  clientAgreements={clientAgreements}
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
  planStatusHistoryMap: selectors.getPlanStatusHistoryMap(state),
  additionalRequirementsMap: selectors.getAdditionalRequirementsMap(state),
  managementConsiderationsMap: selectors.getManagementConsiderationsMap(state),
  isFetchingPlan: selectors.getIsFetchingPlan(state),
  errorFetchingPlan: selectors.getPlanErrorOccured(state),
  references: selectors.getReferences(state),
  isUpdatingStatus: selectors.getIsUpdatingPlanStatus(state),
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
