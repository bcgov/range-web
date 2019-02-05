import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChooseSubmissionTypeTab from './ChooseSubmissionTypeTab';
import SubmitForFeedbackTab from './SubmitForFeedbackTab';
import SubmitForFinalDecisionTab from './SubmitForFinalDecisionTab';
import { PLAN_STATUS } from '../../../constants/variables';
import { isSingleClient } from '../../../utils';

class TabsForSingleAH extends Component {
  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    statusCode: PropTypes.string,
    isAgreed: PropTypes.bool.isRequired,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    statusCode: null,
  };

  state = {
    currTabId: 'chooseSubmissionType',
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({
      currTabId: tabId,
    });
  }

  render() {
    const {
      clients,
      statusCode,
      isAgreed,
      handleStatusCodeChange,
      handleAgreeCheckBoxChange,
      onSubmitClicked,
      onClose,
    } = this.props;
    const { currTabId } = this.state;
    const tabsMap = {
      chooseSubmissionType: {
        id: 'chooseSubmissionType',
        title: '1. Ready to Submit? Choose Your Submission Type',
        back: null,
        next: statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
          ? 'submitForFeedback'
          : 'submitForFinalDecision',
        radio1: 'Make this draft RUP available for the staff to review. They will advise you if the RUP is ready to submit to the decision maker for approval.',
        radio2: 'Verify this RUP is correct and start submission for decision.',
      },
      submitForFeedback: {
        id: 'submitForFeedback',
        title: '2. Submit Your initial range use plan for Review',
        back: 'chooseSubmissionType',
        next: null,
        text1: 'You’re ready to submit an initial range use plan for Range staff review. You will be notified once the submission has been reviewed.',
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '3. Confirm Your Submission and eSignature',
        back: 'chooseSubmissionType',
        next: null,
        text1: 'You are about to submit your initial range use plan.',
        checkbox1: 'I understand that this submission constitues a legal document and eSignature. This submission will be reviewed the Range Staff.',
        submitBtn: 'Submit Initial RUP',
      },
    };

    const isThereSingleAH = isSingleClient(clients);
    if (!isThereSingleAH) {
      return null;
    }

    return (
      <Fragment>
        <ChooseSubmissionTypeTab
          currTabId={currTabId}
          tab={tabsMap.chooseSubmissionType}
          statusCode={statusCode}
          handleStatusCodeChange={handleStatusCodeChange}
          onCancelClicked={onClose}
          onNextClicked={this.handleTabChange}
        />

        <SubmitForFeedbackTab
          currTabId={currTabId}
          tab={tabsMap.submitForFeedback}
          isSubmitting={false}
          onBackClicked={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
        />

        <SubmitForFinalDecisionTab
          currTabId={currTabId}
          tab={tabsMap.submitForFinalDecision}
          isSubmitting={false}
          onBackClicked={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
          handleAgreeCheckBoxChange={handleAgreeCheckBoxChange}
          isAgreed={isAgreed}
        />
      </Fragment>
    );
  }
}

export default TabsForSingleAH;
