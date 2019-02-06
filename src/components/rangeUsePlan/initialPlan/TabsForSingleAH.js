import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChooseSubmissionTypeTab from './ChooseSubmissionTypeTab';
import SubmitForFeedbackTab from './SubmitForFeedbackTab';
import SubmitForFinalDecisionTab from './SubmitForFinalDecisionTab';
import AddDescriptionTab from './AddDescriptionTab';
import { PLAN_STATUS } from '../../../constants/variables';
import { isSingleClient } from '../../../utils';
import LastTab from './LastTab';

class TabsForSingleAH extends Component {
  static propTypes = {
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
  };

  state = {
    currTabId: 'addDescription',
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
      note,
      isSubmitting,
      handleStatusCodeChange,
      handleAgreeCheckBoxChange,
      handleNoteChange,
      onSubmitClicked,
      onClose,
    } = this.props;
    const { currTabId } = this.state;
    const tabsMap = {
      addDescription: {
        id: 'addDescription',
        title: '1. Ready to Submit? Add Plan Description',
        next: 'chooseSubmissionType',
        placeholder: 'Summarize what the proposed range use plan includes. '
          + 'Ex. Grazing schedules reflect change in land use and additional livestock.',
      },
      chooseSubmissionType: {
        id: 'chooseSubmissionType',
        title: '2. Ready to Submit? Choose Your Submission Type',
        back: 'addDescription',
        next: statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
          ? 'submitForFeedback'
          : 'submitForFinalDecision',
        radio1: 'Make this draft RUP available for the staff to review. '
          + 'They will advise you if the RUP is ready to submit to the decision maker for approval.',
        radio2: 'Verify this RUP is correct and start submission for decision.',
      },
      submitForFeedback: {
        id: 'submitForFeedback',
        title: '2. Submit Your initial range use plan for Feedback',
        back: 'chooseSubmissionType',
        next: 'lastTab',
        text1: 'You’re ready to submit an initial range use plan '
          + 'for Range staff review. You will be notified once the submission has been reviewed.',
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '3. Confirm Your Submission and eSignature',
        back: 'chooseSubmissionType',
        next: null,
        text1: 'You are about to submit your initial range use plan.',
        checkbox1: 'I understand that this submission constitues '
          + 'a legal document and eSignature. This submission will be reviewed the Range Staff.',
        rightBtn1: 'Submit Initial RUP',
      },
      lastTab: {
        id: 'lastTab',
        title: 'Your range use plan has been sent for range staff review.',
        text1: 'Your range use plan has been sent to Range staff for review. Feel free to call your Range officer if you have any questions!',
      },
    };

    if (!isSingleClient(clients)) {
      return null;
    }

    return (
      <Fragment>
        <AddDescriptionTab
          currTabId={currTabId}
          tab={tabsMap.addDescription}
          note={note}
          handleNoteChange={handleNoteChange}
          onCancelClicked={onClose}
          onNextClicked={this.handleTabChange}
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
          isSubmitting={false}
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
        />

        <LastTab
          currTabId={currTabId}
          tab={tabsMap.lastTab}
          onClose={onClose}
        />
      </Fragment>
    );
  }
}

export default TabsForSingleAH;
