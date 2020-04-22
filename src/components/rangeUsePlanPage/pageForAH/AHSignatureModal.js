import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Icon } from 'semantic-ui-react'
import { getUser } from '../../../reducers/rootReducer'
import { CONFIRMATION_OPTION } from '../../../constants/variables'
import { findConfirmationWithUser } from '../../../utils'
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

  handleConfirmation = e => {
    e.preventDefault()
    const {
      updateRUPConfirmation,
      plan,
      user,
      confirmationUpdated,
      planUpdated
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

    const currUserConfirmation = findConfirmationWithUser(
      user,
      plan.confirmations
    )
    console.log(currUserConfirmation)

    const confirmed = true
    const isMinorAmendment = false

    onRequest()

    return updateRUPConfirmation(
      plan,
      currUserConfirmation.id,
      confirmed,
      isMinorAmendment
    ).then(
      data => {
        onSuccess(data)
      },
      err => {
        onError(err)
      }
    )
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
