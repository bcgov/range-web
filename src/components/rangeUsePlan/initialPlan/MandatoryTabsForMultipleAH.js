import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChooseAmendmentTypeTab from './submissionTabs/ChooseAmendmentTypeTab';
import ChooseSubmissionTypeTab from './submissionTabs/ChooseSubmissionTypeTab';
import SubmitForFeedbackTab from './submissionTabs/SubmitForFeedbackTab';
import SubmitForFinalDecisionTab from './submissionTabs/SubmitForFinalDecisionTab';
import LastTab from './submissionTabs/LastTab';
import { PLAN_STATUS } from '../../../constants/variables';
import { isSingleClient } from '../../../utils';
import RequestSignaturesTab from './submissionTabs/RequestSignaturesTab';

class MandatoryTabsForMultipleAH extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    isMandatory: PropTypes.bool.isRequired,
    isMinor: PropTypes.bool.isRequired,
    isAmendmentTypeDecided: PropTypes.bool,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    statusCode: PropTypes.string,
    isAgreed: PropTypes.bool.isRequired,
    note: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    handleNoteChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    statusCode: null,
    isAmendmentTypeDecided: false,
  };

  state = {
    currTabId: 'chooseAmendmentType',
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({
      currTabId: tabId,
    });
  }

  render() {
    const {
      user,
      clients,
      statusCode,
      isAgreed,
      isSubmitting,
      handleStatusCodeChange,
      handleAgreeCheckBoxChange,
      onSubmitClicked,
      onClose,
      isMinor,
    } = this.props;
    const { currTabId } = this.state;
    const tabsMap = {
      chooseAmendmentType: {
        id: 'chooseAmendmentType',
        title: '1. Ready to Submit? Choose Your Amendment Type',
        next: 'chooseSubmissionType',
      },
      chooseSubmissionType: {
        id: 'chooseSubmissionType',
        title: '2. Ready to Submit? Choose Your Submission Type',
        back: 'chooseAmendmentType',
        next: statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
          ? 'submitForFeedback'
          : 'submitForFinalDecision',
        radio1: 'Make this draft amendment available for the staff to review. '
          + 'They will advise you if the RUP is ready to submit to the decision maker for approval.',
        radio2: 'Verify this amendment is correct and start submission for decision.',
      },
      submitForFeedback: {
        id: 'submitForFeedback',
        title: '3. Submit Your initial range use plan for Feedback',
        back: 'chooseSubmissionType',
        next: 'last',
        text1: 'You’re ready to submit mandatory amendment for Range staff review. '
          + 'You will be notified once the submission has been reviewed.',
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '3. Confirm Your Submission and eSignature',
        back: 'chooseSubmissionType',
        next: 'requestSignatures',
        text1: 'You are about to submit your mandatory amendment for your RUP.',
        checkbox1: 'I understand that this submission constitues a legal '
          + 'document and eSignature. This submission will be reviewed the Range Staff.',
        rightBtn1: 'Next',
      },
      requestSignatures: {
        id: 'requestSignatures',
        title: '4. Request eSignatures and Submit Range Use Plan for final decision',
        back: 'submitForFinalDecision',
        next: 'last',
        text1: 'You’re ready to submit your mandatory amendment to your range use plan. The secondary agreement holders below will be notified to confirm the submission and provide eSignatures.',
        text2: 'Once all agreement holders have confirmed the submission and provided their eSignature your amendment will be submitted for final decision by Range Staff.',
        text3: 'Agreement holders needed to confirm submission:',
      },
      last: {
        id: 'last',
        title: 'Your mandatory amendment has been sent for range staff review.',
        text1: 'Your mandatory amendment has been sent to Range staff for review. '
         + 'Feel free to call your Range officer if you have any questions!',
      },
    };

    if (isMinor) {
      return null;
    }

    if (isSingleClient(clients)) {
      return null;
    }

    return (
      <Fragment>
        <ChooseAmendmentTypeTab
          {...this.props}
          currTabId={currTabId}
          tab={tabsMap.chooseAmendmentType}
          handleTabChange={this.handleTabChange}
          onCancelClicked={onClose}
        />

        <ChooseSubmissionTypeTab
          currTabId={currTabId}
          tab={tabsMap.chooseSubmissionType}
          statusCode={statusCode}
          handleStatusCodeChange={handleStatusCodeChange}
          onCancelClicked={onClose}
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
          isSubmitting={isSubmitting}
          handleTabChange={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
          handleAgreeCheckBoxChange={handleAgreeCheckBoxChange}
          isAgreed={isAgreed}
          clients={clients}
        />

        <RequestSignaturesTab
          currTabId={currTabId}
          tab={tabsMap.requestSignatures}
          clients={clients}
          user={user}
          isSubmitting={isSubmitting}
          handleTabChange={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
        />

        <LastTab
          currTabId={currTabId}
          tab={tabsMap.last}
          onClose={onClose}
        />
      </Fragment>
    );
  }
}

export default MandatoryTabsForMultipleAH;
