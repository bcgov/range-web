import React, { useState } from 'react';
import { CONFIRMATION_OPTION } from '../../../../constants/variables';
import { getUserFullName, getUserEmail } from '../../../../utils';
import ConfirmChoiceTab from '../confirmationTabs/ConfirmChoiceTab';
import LastTab from '../confirmationTabs/LastTab';
import RequestClarificationTab from '../confirmationTabs/RequestClarificationTab';

interface ConfirmationTabsProps {
  plan: any;
  confirmationOption: string | null;
  onClose: () => void;
  user: any;
  clients: any[];
  clientAgreements: any[];
  isAgreed: boolean;
  isConfirming: boolean;
  handleSubmissionChoiceChange: (...args: any[]) => void;
  handleAgreeCheckBoxChange: (...args: any[]) => void;
  handleConfirmation: (...args: any[]) => any;
  [key: string]: any;
}

function ConfirmationTabs(props: ConfirmationTabsProps) {
  const { plan, confirmationOption, onClose } = props;
  const [currTabId, setCurrTabId] = useState('confirmChoice');

  const handleTabChange = (_e: any, { value: tabId }: any) => {
    setCurrTabId(tabId);
  };

  const tabsMap: any = {
    confirmChoice: {
      id: 'confirmChoice',
      title: '1. Confirm your Submission Choice',
      next: confirmationOption === CONFIRMATION_OPTION.CONFIRM ? 'last' : 'requestClarification',
      radio1:
        'the range use plan will be automatically forwarded for decision' +
        ' once all agreement holders have completed this step.',
      radio2: 'do not agree to the range use plan at this time and get information on options',
    },
    requestClarification: {
      id: 'requestClarification',
      title: '2. Request Clarification or Changes',
      back: 'confirmChoice',
      text1:
        `Please contact ${getUserFullName(plan.creator)} (${getUserEmail(plan.creator)}) ` +
        'who initiated this range use plan for clarification or to request changes.',
      text2:
        'Submissions can only be recalled by ' + `${getUserFullName(plan.creator)} who initiated this range use plan.`,
    },
    last: {
      id: 'last',
      title: 'Your confirmation has been saved',
    },
  };

  return (
    <>
      <ConfirmChoiceTab
        {...props}
        tab={tabsMap.confirmChoice}
        currTabId={currTabId}
        handleTabChange={handleTabChange}
      />

      <RequestClarificationTab
        tab={tabsMap.requestClarification}
        currTabId={currTabId}
        handleTabChange={handleTabChange}
        onClose={onClose}
      />

      <LastTab {...props} tab={tabsMap.last} currTabId={currTabId} />
    </>
  );
}

export default ConfirmationTabs;
