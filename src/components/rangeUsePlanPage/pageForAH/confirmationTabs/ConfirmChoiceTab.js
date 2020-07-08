import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Radio, Form } from 'semantic-ui-react'
import { CONFIRMATION_OPTION } from '../../../../constants/variables'
import RightBtn from '../tab/RightBtn'
import LeftBtn from '../tab/LeftBtn'
import TabTemplate from '../tab/TabTemplate'
import AHConfirmationList from './AHConfirmationList'

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */

class ConfirmChoiceTab extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    currTabId: PropTypes.string.isRequired,
    confirmationOption: PropTypes.string,
    isAgreed: PropTypes.bool.isRequired,
    isConfirming: PropTypes.bool.isRequired,
    handleSubmissionChoiceChange: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    handleConfirmation: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      next: PropTypes.string,
      radio1: PropTypes.string,
      radio2: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
    confirmationOption: null
  }

  onNextClicked = e => {
    const { handleTabChange, tab } = this.props

    handleTabChange(e, { value: tab.next })
  }

  handleConfirmation = e => {
    this.props.handleConfirmation(e).then(() => {
      this.onNextClicked()
    })
  }

  render() {
    const {
      user,
      clients,
      clientAgreements,
      plan,
      currTabId,
      tab,
      confirmationOption,
      isAgreed,
      isConfirming,
      handleSubmissionChoiceChange,
      handleAgreeCheckBoxChange,
      onClose
    } = this.props
    const { id, title, radio1, radio2 } = tab
    const isActive = id === currTabId

    if (!isActive) {
      return null
    }
    let isConfirmBtnDisabled = confirmationOption === null
    if (confirmationOption === CONFIRMATION_OPTION.CONFIRM) {
      isConfirmBtnDisabled = !isAgreed
    }

    return (
      <TabTemplate
        isActive={isActive}
        title={title}
        actions={
          <Fragment>
            <LeftBtn onClick={onClose} content="Cancel" />
            <RightBtn
              onClick={
                confirmationOption === CONFIRMATION_OPTION.REQUEST
                  ? this.onNextClicked
                  : this.handleConfirmation
              }
              loading={isConfirming}
              disabled={isConfirmBtnDisabled}
              content="Confirm"
            />
          </Fragment>
        }
        content={
          <Form>
            <Form.Field className="rup__multi-tab__radio-field">
              <Radio
                className="rup__multi-tab__radio"
                label={
                  <label>
                    <b>Confirm and send for final decision: </b>
                    {radio1}
                  </label>
                }
                name="radioGroup"
                value={CONFIRMATION_OPTION.CONFIRM}
                checked={confirmationOption === CONFIRMATION_OPTION.CONFIRM}
                onChange={handleSubmissionChoiceChange}
              />
            </Form.Field>

            <Form.Field className="rup__multi-tab__radio-field">
              <Radio
                className="rup__multi-tab__radio"
                label={
                  <label>
                    <b>Request clarification or changes: </b>
                    {radio2}
                  </label>
                }
                name="radioGroup"
                value={CONFIRMATION_OPTION.REQUEST}
                checked={confirmationOption === CONFIRMATION_OPTION.REQUEST}
                onChange={handleSubmissionChoiceChange}
              />
            </Form.Field>

            <AHConfirmationList
              user={user}
              clients={clients}
              plan={plan}
              clientAgreements={clientAgreements}
            />

            <Form.Checkbox
              label="I understand that this submission constitues a legal document and eSignature. This submission will be reviewed by the range staff before it is forwarded to the decision maker."
              checked={isAgreed}
              style={{ marginTop: '20px' }}
              disabled={confirmationOption !== CONFIRMATION_OPTION.CONFIRM}
              onChange={handleAgreeCheckBoxChange}
            />
          </Form>
        }
      />
    )
  }
}

export default ConfirmChoiceTab
