import React from 'react';
import SubmitForFinalDecisionTab from '../submissionTabs/SubmitForFinalDecisionTab';
import LastTab from '../submissionTabs/LastTab';
import { isSingleClient } from '../../../../utils';

interface MinorTabsForSingleAHProps {
  isMandatory: boolean;
  clients: any[];
  isAgreed: boolean;
  isSubmitting: boolean;
  handleAgreeCheckBoxChange: (...args: any[]) => void;
  onSubmitClicked: (...args: any[]) => any;
  onClose: () => void;
  handleTabChange: (...args: any[]) => void;
  currTabId: string;
}

function MinorTabsForSingleAH(props: MinorTabsForSingleAHProps) {
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
  } = props;

  const tabsMap: any = {
    submitForFinalDecision: {
      id: 'submitForFinalDecision',
      title: '2. Confirm Your Submission and eSignature',
      back: 'chooseAmendmentType',
      next: 'last',
      shouldSubmit: true,
      text1:
        'You are about to submit your minor amendment for your RUP. Minor amendments to your range plan take effect immediately once submitted.',
      checkbox1:
        'I understand that this submission constitutes a legal document and eSignature. Changes to the current Range Use Plan will be take effect immediately.',
      rightBtn1: 'Submit Amendment',
    },
    last: {
      id: 'last',
      title: 'Your minor amendment has been applied to your range use plan.',
      text1:
        'Your minor amendment has been applied to your active range use plan. No further action is required unless range staff finds errors in your submission.',
    },
  };

  if (isMandatory || !isSingleClient(clients)) {
    return null;
  }

  return (
    <>
      <SubmitForFinalDecisionTab
        currTabId={currTabId}
        tab={tabsMap.submitForFinalDecision}
        isSubmitting={isSubmitting}
        handleTabChange={handleTabChange}
        onSubmitClicked={onSubmitClicked}
        handleAgreeCheckBoxChange={handleAgreeCheckBoxChange}
        isAgreed={isAgreed}
      />
      <LastTab currTabId={currTabId} tab={tabsMap.last} onClose={onClose} />
    </>
  );
}

export default MinorTabsForSingleAH;
