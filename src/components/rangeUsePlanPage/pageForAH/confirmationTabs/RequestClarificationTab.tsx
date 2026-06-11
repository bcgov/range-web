import React from 'react';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';

interface RequestClarificationTabProps {
  currTabId: string;
  onClose: () => void;
  handleTabChange: (...args: any[]) => void;
  tab: { id?: string; title?: string; back?: string; text1?: string; text2?: string };
}

const RequestClarificationTab: React.FC<RequestClarificationTabProps> = ({ currTabId, tab, onClose, handleTabChange }) => {
  const { id, title, text1, text2 } = tab;
  const isActive = id === currTabId;

  if (!isActive) {
    return null;
  }

  const onBackClicked = (e: any) => {
    handleTabChange(e, { value: tab.back });
  };

  return (
    <TabTemplate
      isActive={isActive}
      title={title || ''}
      actions={
        <>
          <LeftBtn onClick={onBackClicked} content="Back" />
          <RightBtn onClick={onClose} content="Close" />
        </>
      }
      content={
        <>
          <div className="rup__confirmation__request__header">Your approval has not been submitted.</div>
          <div style={{ marginBottom: '20px' }}>{text1}</div>
          <div style={{ marginBottom: '20px' }}>{text2}</div>
        </>
      }
    />
  );
};

export default RequestClarificationTab;
