import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SubmitForFinalDecisionTab from '../submissionTabs/SubmitForFinalDecisionTab';
import LastTab from '../submissionTabs/LastTab';
import { isSingleClient } from '../../../../utils';

class MinorTabsForSingleAH extends Component {
  static propTypes = {
    isMandatory: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    isAgreed: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    currTabId: PropTypes.string.isRequired,
  }

  static defaultProps = {

  };

  render() {
    const {
      clients,
      isAgreed,
      isSubmitting,
      handleAgreeCheckBoxChange,
      onSubmitClicked,
      onClose,
      isMandatory,
      handleTabChange,
      currTabId,
    } = this.props;
    const tabsMap = {
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

    if (isMandatory || !isSingleClient(clients)) {
      return null;
    }

    return (
      <Fragment>
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

export default MinorTabsForSingleAH;
