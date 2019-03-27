import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChooseSubmissionTypeTab from '../submissionTabs/ChooseSubmissionTypeTab';
import SubmitForFeedbackTab from '../submissionTabs/SubmitForFeedbackTab';
import SubmitForFinalDecisionTab from '../submissionTabs/SubmitForFinalDecisionTab';
import LastTab from '../submissionTabs/LastTab';
import { PLAN_STATUS } from '../../../../constants/variables';
import { isSingleClient } from '../../../../utils';

class MandatoryTabsForSingleAH extends Component {
  static propTypes = {
    isMinor: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    statusCode: PropTypes.string,
    isAgreed: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    currTabId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    statusCode: null,
  };

  render() {
    const {
      clients,
      statusCode,
      isAgreed,
      isSubmitting,
      handleStatusCodeChange,
      handleAgreeCheckBoxChange,
      onSubmitClicked,
      onClose,
      isMinor,
      currTabId,
      handleTabChange,
    } = this.props;
    const tabsMap = {
      chooseSubmissionType: {
        id: 'chooseSubmissionType',
        title: '2. Ready to Submit? Choose Your Submission Type',
        back: 'chooseAmendmentType',
        next: statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
          ? 'submitForFeedback'
          : 'submitForFinalDecision',
        radio1: 'Make this draft amendment available for the staff to review. '
          + 'They will advise you if the RUP is ready to submit to the decision maker for approval or make content suggestions.',
        radio2: 'Verify this amendment is correct and start submission for decision.',
      },
      submitForFeedback: {
        id: 'submitForFeedback',
        title: '3. Submit your initial range use plan for feedback',
        back: 'chooseSubmissionType',
        next: 'last',
        text1: 'You’re ready to submit mandatory amendment for Range staff review. '
          + 'You will be notified once the submission has been reviewed.',
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '3. Confirm Your Submission and eSignature',
        back: 'chooseSubmissionType',
        next: 'last',
        shouldSubmit: true,
        text1: 'You are about to submit your mandatory amendment for your RUP.',
        checkbox1: 'I understand that this submission constitues a legal '
          + 'document and eSignature. This submission will be reviewed by the range staff before it is forwarded to the decision maker.',
        rightBtn1: 'Submit Amendment',
      },
      last: {
        id: 'last',
        title: 'Your mandatory amendment has been sent for range staff review.',
        text1: 'Your mandatory amendment has been sent to Range staff for review. '
         + 'Feel free to call your Range officer if you have any questions!',
      },
    };

    if (isMinor || !isSingleClient(clients)) {
      return null;
    }

    return (
      <Fragment>
        <ChooseSubmissionTypeTab
          currTabId={currTabId}
          tab={tabsMap.chooseSubmissionType}
          statusCode={statusCode}
          handleStatusCodeChange={handleStatusCodeChange}
          onClose={onClose}
          handleTabChange={handleTabChange}
        />

        <SubmitForFeedbackTab
          currTabId={currTabId}
          tab={tabsMap.submitForFeedback}
          isSubmitting={isSubmitting}
          handleTabChange={handleTabChange}
          onSubmitClicked={onSubmitClicked}
        />

        <SubmitForFinalDecisionTab
          currTabId={currTabId}
          tab={tabsMap.submitForFinalDecision}
          isSubmitting={isSubmitting}
          handleTabChange={handleTabChange}
          onSubmitClicked={onSubmitClicked}
          handleAgreeCheckBoxChange={handleAgreeCheckBoxChange}
          isAgreed={isAgreed}
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

export default MandatoryTabsForSingleAH;
