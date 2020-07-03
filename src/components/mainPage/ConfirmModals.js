import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Icon } from 'semantic-ui-react'
import { closeConfirmationModal } from '../../actions'
import { getConfirmationModalsMap } from '../../reducers/rootReducer'
import { getObjValues } from '../../utils'
import { PrimaryButton } from '../common'

class ConfirmModals extends Component {
  static propTypes = {
    confirmationModalsMap: PropTypes.shape({}).isRequired,
    closeConfirmationModal: PropTypes.func.isRequired
  }

  renderConfirmationModal = modal => {
    const { closeConfirmationModal } = this.props
    const {
      id: modalId,
      header,
      content,
      onYesBtnClicked: oYBClicked,
      closeAfterYesBtnClicked
    } = modal
    let onYesBtnClicked = oYBClicked
    if (closeAfterYesBtnClicked) {
      onYesBtnClicked = () => {
        closeConfirmationModal({ modalId })
        oYBClicked()
      }
    }

    return (
      <Modal
        key={modalId}
        dimmer="blurring"
        size="tiny"
        open
        onClose={() => closeConfirmationModal({ modalId })}
        closeIcon={<Icon name="close" color="black" />}>
        <Modal.Header as="h2" content={header} />
        <Modal.Content>
          <div className="confirmation-modal__content">{content}</div>
          <div className="confirmation-modal__btns">
            <PrimaryButton
              inverted
              onClick={() => closeConfirmationModal({ modalId })}>
              <Icon name="remove" />
              Cancel
            </PrimaryButton>
            <PrimaryButton
              style={{ marginLeft: '15px' }}
              onClick={onYesBtnClicked}>
              <Icon name="checkmark" />
              Confirm
            </PrimaryButton>
          </div>
        </Modal.Content>
      </Modal>
    )
  }

  render() {
    const confirmationModals = getObjValues(this.props.confirmationModalsMap)

    return (
      <Fragment>
        {confirmationModals.map(this.renderConfirmationModal)}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  confirmationModalsMap: getConfirmationModalsMap(state)
})
export default connect(
  mapStateToProps,
  { closeConfirmationModal }
)(ConfirmModals)
