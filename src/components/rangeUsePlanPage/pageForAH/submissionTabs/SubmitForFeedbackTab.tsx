import React from 'react';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';

interface SubmitForFeedbackTabProps {
  currTabId: string;
  isSubmitting: boolean;
  handleTabChange: (...args: any[]) => void;
  onSubmitClicked: (...args: any[]) => any;
  tab: { id: string; title: string; back: string; next: string; text1: string };
}

const SubmitForFeedbackTab: React.FC<SubmitForFeedbackTabProps> = ({ currTabId, tab, isSubmitting, handleTabChange, onSubmitClicked }) => {
  const { id, title, text1 } = tab;
  const isActive = id === currTabId;

  if (!isActive) {
    return null;
  }

  const onBackClicked = (e: any) => {
    handleTabChange(e, { value: tab.back });
  };

  const handleSubmit = (e: any) => {
    onSubmitClicked(e).then(() => {
      handleTabChange(e, { value: tab.next });
    });
  };

  return (
    <TabTemplate
      isActive={isActive}
      title={title}
      actions={
        <>
          <LeftBtn onClick={onBackClicked} content="Back" />
          <RightBtn onClick={handleSubmit} loading={isSubmitting} content="Submit For Feedback" />
        </>
      }
      content={<div>{text1}</div>}
    />
  );
};

export default SubmitForFeedbackTab;
