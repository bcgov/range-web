import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ChooseSubmissionTypeTab from '../submissionTabs/ChooseSubmissionTypeTab'
import SubmitForFeedbackTab from '../submissionTabs/SubmitForFeedbackTab'
import SubmitForFinalDecisionTab from '../submissionTabs/SubmitForFinalDecisionTab'
import AddDescriptionTab from '../submissionTabs/AddDescriptionTab'
import RequestSignaturesTab from '../submissionTabs/RequestSignaturesTab'
import LastTab from '../submissionTabs/LastTab'
import { PLAN_STATUS } from '../../../../constants/variables'
import { isSingleClient } from '../../../../utils'

class TabsForMultipleAH extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    clientAgreements: PropTypes.array.isRequired,
    statusCode: PropTypes.string,
    isSubmitting: PropTypes.bool.isRequired,
    isAgreed: PropTypes.bool.isRequired,
    note: PropTypes.string.isRequired,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    handleNoteChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  static defaultProps = {
    statusCode: null
  }

  state = {
    currTabId: 'addDescription'
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({
      currTabId: tabId
    })
  }

  render() {
    const {
      clients,
      statusCode,
      isAgreed,
      note,
      isSubmitting,
      handleStatusCodeChange,
      handleAgreeCheckBoxChange,
      handleNoteChange,
      onSubmitClicked,
      onClose,
      user,
      clientAgreements
    } = this.props
    const { currTabId } = this.state
    const tabsMap = {
      addDescription: {
        id: 'addDescription',
        title: '1. Ready to Submit? Add Plan Description',
        next: 'chooseSubmissionType',
        placeholder:
          'Summarize what the proposed range use plan includes. ' +
          'Ex. Grazing schedules reflect change in land use and additional livestock.'
      },
      chooseSubmissionType: {
        id: 'chooseSubmissionType',
        title: '2. Ready to Submit? Choose Your Submission Type',
        back: 'addDescription',
        next:
          statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
            ? 'submitForFeedback'
            : 'submitForFinalDecision',
        radio1:
          'Make this draft RUP available for the staff to review. ' +
          'They will advise you if the RUP is ready to submit to the decision maker for approval or make content suggestions.',
        radio2: 'Verify this RUP is correct and start submission for decision.'
      },
      submitForFeedback: {
        id: 'submitForFeedback',
        title: '2. Submit your initial range use plan for feedback',
        back: 'chooseSubmissionType',
        next: 'last',
        text1:
          'You’re ready to submit an initial range use plan ' +
          'for Range staff review. You will be notified once the submission has been reviewed.'
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '3. Confirm Your Submission and eSignature',
        back: 'chooseSubmissionType',
        next: 'requestSignatures',
        shouldSubmit: false,
        text1: 'You are about to submit your initial range use plan.',
        checkbox1:
          'I understand that this submission constitues ' +
          'a legal document and eSignature. This submission will be reviewed by the range staff before it is forwarded to the decision maker.',
        rightBtn1: 'Next'
      },
      requestSignatures: {
        id: 'requestSignatures',
        title:
          '4. Request eSignatures and Submit Range Use Plan for final decision',
        back: 'submitForFinalDecision',
        next: 'last',
        text1:
          'You have signed your range use plan submission. The agreement holders below will be notified to confirm the submission and provide eSignatures.',
        text2:
          'Once all agreement holders have confirmed the submission and provided their eSignature your range use plan will be submitted for final decision by range staff.',
        text3: 'Agreement holders needed to confirm submission:'
      },
      last: {
        id: 'last',
        title:
          statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
            ? 'Your range use plan has been sent for range staff review.'
            : 'Your range use plan has been sent to other agreement holders for confirmation.',
        text1:
          statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
            ? 'Your range use plan has been sent to Range staff for review. Feel free to call your Range officer if you have any questions!'
            : 'Your range use plan has been sent to other agreement holders for confirmation. This submission will be reviewed by the range staff before it is forwarded to the decision maker.'
      }
    }

    if (isSingleClient(clients)) {
      return null
    }

    return (
      <Fragment>
        <AddDescriptionTab
          currTabId={currTabId}
          tab={tabsMap.addDescription}
          note={note}
          handleNoteChange={handleNoteChange}
          onClose={onClose}
          onNextClicked={this.handleTabChange}
        />

        <ChooseSubmissionTypeTab
          currTabId={currTabId}
          tab={tabsMap.chooseSubmissionType}
          statusCode={statusCode}
          handleStatusCodeChange={handleStatusCodeChange}
          onClose={onClose}
          handleTabChange={this.handleTabChange}
        />

        <SubmitForFeedbackTab
          currTabId={currTabId}
          tab={tabsMap.submitForFeedback}
          isSubmitting={isSubmitting}
          handleTabChange={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
        />

        <SubmitForFinalDecisionTab
          currTabId={currTabId}
          tab={tabsMap.submitForFinalDecision}
          handleTabChange={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
          handleAgreeCheckBoxChange={handleAgreeCheckBoxChange}
          isAgreed={isAgreed}
        />

        <RequestSignaturesTab
          currTabId={currTabId}
          tab={tabsMap.requestSignatures}
          clients={clients}
          clientAgreements={clientAgreements}
          user={user}
          isSubmitting={isSubmitting}
          handleTabChange={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
        />

        <LastTab currTabId={currTabId} tab={tabsMap.last} onClose={onClose} />
      </Fragment>
    )
  }
}

export default TabsForMultipleAH
