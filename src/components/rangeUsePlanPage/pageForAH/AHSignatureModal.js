import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Icon } from 'semantic-ui-react'
import { getUser } from '../../../reducers/rootReducer'
import {
  CONFIRMATION_OPTION,
  REFERENCE_KEY,
  AMENDMENT_TYPE
} from '../../../constants/variables'
import { isPlanAmendment, findConfirmationsWithUser } from '../../../utils'
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator'
import { planUpdated, confirmationUpdated } from '../../../actions'
import ConfirmationTabs from './tabs/ConfirmationTabs'

// modal for an agreement holder to sign a submitted range use plan

class AHSignatureModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    updateRUPConfirmation: PropTypes.func.isRequired,
    confirmationUpdated: PropTypes.func.isRequired,
    planUpdated: PropTypes.func.isRequired
  }

  static defaultProps = {
    clients: []
  }

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => ({
    isAgreed: false,
    isConfirming: false,
    confirmationOption: null
  })

  onClose = () => {
    this.setState(this.getInitialState())
    this.props.onClose()
  }

  handleConfirmation = async e => {
    e.preventDefault()
    const {
      updateRUPConfirmation,
      plan,
      user,
      clientAgreements,
      confirmationUpdated,
      planUpdated,
      references
    } = this.props

    const onRequest = () => this.setState({ isConfirming: true })
    const onSuccess = data => {
      const { allConfirmed, plan: updatedPlan, confirmation } = data

      if (allConfirmed) {
        planUpdated({ plan: { ...plan, ...updatedPlan } })
      }

      confirmationUpdated({ confirmation })
      this.setState({ isConfirming: false })
      if (this.props.onSuccess) this.props.onSuccess()
    }
    const onError = err => {
      this.setState({ isConfirming: false })
      throw err
    }

    const currUserConfirmations = findConfirmationsWithUser(
      user,
      plan.confirmations,
      clientAgreements
    )

    const confirmed = true
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
    const minorAmendmentType = amendmentTypes.find(
      a => a.code === AMENDMENT_TYPE.MINOR
    )
    const isMinorAmendment =
      isPlanAmendment(plan) && plan.amendmentTypeId === minorAmendmentType.id

    onRequest()

    try {
      let data
      for (const currUserConfirmation of currUserConfirmations) {
        if (!currUserConfirmation.confirmed) {
          const isOwnSignature = user.clients.some(
            c => c.id === currUserConfirmation.clientId
          )
          const res = await updateRUPConfirmation(
            plan,
            user,
            currUserConfirmation.id,
            confirmed,
            isMinorAmendment,
            isOwnSignature
          )
          data = res
        }
      }

      onSuccess(data)
    } catch (e) {
      onError(e)
    }
  }

  handleSubmissionChoiceChange = (e, { value: confirmationOption }) => {
    if (confirmationOption === CONFIRMATION_OPTION.REQUEST) {
      this.setState({ confirmationOption, isAgreed: false })
      return
    }

    this.setState({ confirmationOption })
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked })
  }

  render() {
    const { open } = this.props
    const { isAgreed, isConfirming, confirmationOption } = this.state

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={this.onClose}
        closeIcon={<Icon name="close" color="black" />}>
        <Modal.Content>
          <ConfirmationTabs
            {...this.props}
            onClose={this.onClose}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleConfirmation={this.handleConfirmation}
            handleSubmissionChoiceChange={this.handleSubmissionChoiceChange}
            isAgreed={isAgreed}
            isConfirming={isConfirming}
            confirmationOption={confirmationOption}
          />
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  user: getUser(state)
})

export default connect(
  mapStateToProps,
  {
    updateRUPConfirmation,
    planUpdated,
    confirmationUpdated
  }
)(AHSignatureModal)
