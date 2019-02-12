import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChooseAmendmentTypeTab from './submissionTabs/ChooseAmendmentTypeTab';
import SubmitForFinalDecisionTab from './submissionTabs/SubmitForFinalDecisionTab';
import LastTab from './submissionTabs/LastTab';
import { isSingleClient } from '../../../utils';

class MinorTabsForSingleAH extends Component {
  static propTypes = {
    isMandatory: PropTypes.bool.isRequired,
    isMinor: PropTypes.bool.isRequired,
    isAmendmentTypeDecided: PropTypes.bool,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    isAgreed: PropTypes.bool.isRequired,
    note: PropTypes.string.isRequired,
    amendmentTypeCode: PropTypes.string,
    isSubmitting: PropTypes.bool.isRequired,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    handleNoteChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    amendmentTypeCode: null,
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
      clients,
      isAgreed,
      isSubmitting,
      handleAgreeCheckBoxChange,
      onSubmitClicked,
      onClose,
      isMandatory,
    } = this.props;
    const { currTabId } = this.state;
    const tabsMap = {
      chooseAmendmentType: {
        id: 'chooseAmendmentType',
        title: '1. Ready to Submit? Choose Your Amendment Type',
        next: 'submitForFinalDecision',
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '2. Confirm Your Submission and eSignature',
        back: 'chooseAmendmentType',
        next: 'last',
        shouldSubmit: true,
        text1: 'You are about to submit your minor amendment for your RUP. Minor amendments to your range plan take effect immediately once submitted.',
        checkbox1: 'I understand that this submission constitues a legal document and eSignature. Changes to the current Range Use Plan will be take effect immediatly.',
        rightBtn1: 'Submit Amendment',
      },
      last: {
        id: 'last',
        title: 'Your minor amendment has been applied to your range use plan.',
        text1: 'Your minor amendment has been applied to your active range use plan. No further action is required unless Range Staff finds errors in your submission.',
      },
    };

    if (isMandatory) {
      return null;
    }

    if (!isSingleClient(clients)) {
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
          tab={tabsMap.last}
          onClose={onClose}
        />
      </Fragment>
    );
  }
}

export default MinorTabsForSingleAH;
