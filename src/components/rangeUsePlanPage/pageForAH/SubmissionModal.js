import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Icon } from 'semantic-ui-react'
import {
  PLAN_STATUS,
  NUMBER_OF_LIMIT_FOR_NOTE
} from '../../../constants/variables'
import { getReferences, getUser } from '../../../reducers/rootReducer'
import { planUpdated } from '../../../actions'
import {
  isSingleClient,
  findStatusWithCode,
  findConfirmationsWithUser
} from '../../../utils'
import TabsForSingleAH from './tabs/TabsForSingleAH'
import TabsForMultipleAH from './tabs/TabsForMultipleAH'
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator'

class SubmissionModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    fetchPlan: PropTypes.func.isRequired,
    updateStatusAndContent: PropTypes.func.isRequired
  }

  static defaultProps = {
    clients: []
  }

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => ({
    statusCode: null,
    isAgreed: false,
    note: '',
    isSubmitting: false
  })

  onClose = () => {
    this.setState(this.getInitialState())
    this.props.onClose()
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

  submitPlan = (plan, status) => {
    const {
      updateStatusAndContent,
      updateRUPConfirmation,
      fetchPlan,
      user,
      clientAgreements
    } = this.props
    const { note } = this.state

    const onRequest = () => {
      this.setState({ isSubmitting: true })
    }
    const onSuccess = async () => {
      const currUserConfirmations = findConfirmationsWithUser(
        user,
        plan.confirmations,
        clientAgreements
      )
      const confirmed = true
      const isMinorAmendment = false
      if (status.id === 14 || status.id === 18) {
        for (const currUserConfirmation of currUserConfirmations) {
          const isOwnSignature = user.clients.some(
            c => c.id === currUserConfirmation.clientId
          )
          await updateRUPConfirmation(
            plan,
            user,
            currUserConfirmation.id,
            confirmed,
            isMinorAmendment,
            isOwnSignature
          )
        }
      }

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
    const { statusCode } = this.state
    const confirmationAwaiting = findStatusWithCode(
      references,
      PLAN_STATUS.AWAITING_CONFIRMATION
    )
    const status = findStatusWithCode(references, statusCode)
    const isSubmittedForFinal =
      statusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION

    if (!isSingleClient(clients) && isSubmittedForFinal) {
      return this.submitPlan(plan, confirmationAwaiting)
    } else {
      return this.submitPlan(plan, status)
    }
  }

  render() {
    const { open, clients, user, clientAgreements } = this.props
    const { isSubmitting, statusCode, isAgreed, note } = this.state

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={this.onClose}
        closeIcon={<Icon name="close" color="black" />}>
        <Modal.Content>
          <TabsForSingleAH
            clients={clients}
            statusCode={statusCode}
            isAgreed={isAgreed}
            note={note}
            isSubmitting={isSubmitting}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleStatusCodeChange={this.handleStatusCodeChange}
            handleNoteChange={this.handleNoteChange}
            onSubmitClicked={this.onSubmitClicked}
            onClose={this.onClose}
          />

          <TabsForMultipleAH
            clients={clients}
            clientAgreements={clientAgreements}
            statusCode={statusCode}
            isAgreed={isAgreed}
            note={note}
            isSubmitting={isSubmitting}
            user={user}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleStatusCodeChange={this.handleStatusCodeChange}
            handleNoteChange={this.handleNoteChange}
            onSubmitClicked={this.onSubmitClicked}
            onClose={this.onClose}
          />
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
    updateRUPConfirmation
  }
)(SubmissionModal)
