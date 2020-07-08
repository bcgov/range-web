import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Icon } from 'semantic-ui-react'
import {
  NUMBER_OF_LIMIT_FOR_NOTE,
  REFERENCE_KEY,
  AMENDMENT_TYPE,
  PLAN_STATUS
} from '../../../constants/variables'
import { getReferences, getUser } from '../../../reducers/rootReducer'
import { updateRUP } from '../../../actionCreators/planActionCreator'
import { planUpdated } from '../../../actions'
import {
  isMinorAmendment,
  isMandatoryAmendment,
  isSubmittedAsMinor,
  isSubmittedAsMandatory,
  findStatusWithCode,
  isSingleClient,
  findConfirmationsWithUser
} from '../../../utils'
import MandatoryTabsForSingleAH from './tabs/MandatoryTabsForSingleAH'
import MandatoryTabsForMultipleAH from './tabs/MandatoryTabsForMultipleAH'
import MinorTabsForSingleAH from './tabs/MinorTabsForSingleAH'
import MinorTabsForMultipleAH from './tabs/MinorTabsForMultipleAH'
import ChooseAmendmentTypeTab from './submissionTabs/ChooseAmendmentTypeTab'
import { updateConfirmation } from '../../../api'

class AmendmentSubmissionModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    fetchPlan: PropTypes.func.isRequired,
    updateStatusAndContent: PropTypes.func.isRequired,
    updateRUP: PropTypes.func.isRequired
  }

  static defaultProps = {
    clients: []
  }

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => ({
    currTabId: 'chooseAmendmentType',
    amendmentTypeCode: null,
    statusCode: null,
    isAgreed: false,
    isSubmitting: false,
    note: ''
  })

  onClose = () => {
    this.setState(this.getInitialState())
    this.props.onClose()
  }

  handleAmendmentTypeChange = (e, { value: amendmentTypeCode }) => {
    this.setState({
      ...this.getInitialState(),
      amendmentTypeCode
    })
  }

  handleStatusCodeChange = (e, { value: statusCode }) => {
    this.setState({ statusCode })
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked })
  }

  handleNoteChange = (e, { value: note }) => {
    if (note.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      this.setState({ note })
    }
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({ currTabId: tabId })
  }

  submitAmendment = (plan, status, amendmentType) => {
    const {
      updateStatusAndContent,
      updateRUP,
      fetchPlan,
      user,
      clientAgreements
    } = this.props
    const { note } = this.state

    const onRequest = () => {
      this.setState({ isSubmitting: true })
    }
    const onSuccess = async () => {
      // awaiting confirmation
      if (status.id === 18) {
        const currUserConfirmations = findConfirmationsWithUser(
          user,
          plan.confirmations,
          clientAgreements
        )

        for (const currUserConfirmation of currUserConfirmations) {
          const isOwnSignature = user.clients.some(
            c => c.id === currUserConfirmation.clientId
          )

          await updateConfirmation({
            planId: plan.id,
            user,
            confirmationId: currUserConfirmation.id,
            confirmed: true,
            isMinorAmendment: true,
            isOwnSignature
          })
        }
      }

      // update amendment type of the plan
      await updateRUP(plan.id, {
        amendmentTypeId: amendmentType.id
      })
      await fetchPlan()
      this.setState({ isSubmitting: false })
    }
    const onError = () => {
      this.onClose()
    }

    return updateStatusAndContent(
      { status, note },
      onRequest,
      onSuccess,
      onError
    )
  }

  onSubmitClicked = e => {
    e.preventDefault()
    const { plan, references, clients } = this.props
    const { statusCode, amendmentTypeCode } = this.state
    const { amendmentTypeId } = plan
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
    const minor = amendmentTypes.find(at => at.code === AMENDMENT_TYPE.MINOR)
    const mandatory = amendmentTypes.find(
      at => at.code === AMENDMENT_TYPE.MANDATORY
    )
    const confirmationAwaiting = findStatusWithCode(
      references,
      PLAN_STATUS.AWAITING_CONFIRMATION
    )
    const selectedStatusForMandatory = findStatusWithCode(
      references,
      statusCode
    )
    const isMinor = isMinorAmendment(
      amendmentTypeId,
      amendmentTypes,
      amendmentTypeCode
    )
    const isMandatory = isMandatoryAmendment(
      amendmentTypeId,
      amendmentTypes,
      amendmentTypeCode
    )

    if (isMinor && isSingleClient(clients)) {
      const standsNotReviewed = findStatusWithCode(
        references,
        PLAN_STATUS.STANDS_NOT_REVIEWED
      )
      return this.submitAmendment(plan, standsNotReviewed, minor)
    }

    if (isMinor && !isSingleClient(clients)) {
      return this.submitAmendment(plan, confirmationAwaiting, minor)
    }

    if (isMandatory && isSingleClient(clients)) {
      return this.submitAmendment(plan, selectedStatusForMandatory, mandatory)
    }

    if (isMandatory && !isSingleClient(clients)) {
      if (statusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION) {
        return this.submitAmendment(plan, confirmationAwaiting, mandatory)
      }
      return this.submitAmendment(plan, selectedStatusForMandatory, mandatory)
    }

    return null
  }

  render() {
    const {
      open,
      references,
      plan,
      clients,
      user,
      clientAgreements
    } = this.props
    const { amendmentTypeCode, currTabId } = this.state
    const { amendmentTypeId } = plan
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
    const isSubmittedAsMinorAmendment = isSubmittedAsMinor(
      amendmentTypeId,
      amendmentTypes
    )
    const isSubmittedAsMandatoryAmendment = isSubmittedAsMandatory(
      amendmentTypeId,
      amendmentTypes
    )
    const isAmendmentTypeDecided =
      isSubmittedAsMinorAmendment || isSubmittedAsMandatoryAmendment
    const isMinor = isMinorAmendment(
      amendmentTypeId,
      amendmentTypes,
      amendmentTypeCode
    )
    const isMandatory = isMandatoryAmendment(
      amendmentTypeId,
      amendmentTypes,
      amendmentTypeCode
    )
    const commonProps = {
      ...this.state,
      user,
      clients,
      clientAgreements,
      isAmendmentTypeDecided,
      isMinor,
      isMandatory,
      handleAmendmentTypeChange: this.handleAmendmentTypeChange,
      handleNoteChange: this.handleNoteChange,
      handleStatusCodeChange: this.handleStatusCodeChange,
      handleAgreeCheckBoxChange: this.handleAgreeCheckBoxChange,
      handleTabChange: this.handleTabChange,
      onSubmitClicked: this.onSubmitClicked,
      onClose: this.onClose
    }
    const chooseAmendmentTypeTab = {
      id: 'chooseAmendmentType',
      title: '1. Ready to Submit? Choose Your Amendment Type',
      next: isMinor ? 'submitForFinalDecision' : 'chooseSubmissionType'
    }

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={this.onClose}
        closeIcon={<Icon name="close" color="black" />}>
        <Modal.Content>
          <ChooseAmendmentTypeTab
            {...commonProps}
            currTabId={currTabId}
            tab={chooseAmendmentTypeTab}
            handleTabChange={this.handleTabChange}
          />

          <MinorTabsForSingleAH {...commonProps} />

          <MinorTabsForMultipleAH {...commonProps} />

          <MandatoryTabsForSingleAH {...commonProps} />

          <MandatoryTabsForMultipleAH {...commonProps} />
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  user: getUser(state),
  references: getReferences(state)
})

export default connect(
  mapStateToProps,
  {
    planUpdated,
    updateRUP
  }
)(AmendmentSubmissionModal)
