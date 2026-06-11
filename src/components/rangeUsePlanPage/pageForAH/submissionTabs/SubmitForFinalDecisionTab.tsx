import React from 'react';
import { Form as SUIForm } from 'semantic-ui-react';
const Form = SUIForm as any;
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';

interface SubmitForFinalDecisionTabProps {
  currTabId: string;
  isSubmitting?: boolean;
  handleTabChange: (...args: any[]) => void;
  onSubmitClicked: (...args: any[]) => any;
  handleAgreeCheckBoxChange: (...args: any[]) => void;
  isAgreed: boolean;
  tab: {
    id: string;
    title: string;
    back: string;
    next: string;
    shouldSubmit: boolean;
    text1: string;
    text2?: string;
    rightBtn1: string;
    checkbox1?: string;
  };
  clients?: any[];
}

function SubmitForFinalDecisionTab({
  currTabId,
  tab,
  isSubmitting = false,
  handleAgreeCheckBoxChange,
  isAgreed,
  handleTabChange,
  onSubmitClicked,
}: SubmitForFinalDecisionTabProps) {
  const { id, title, shouldSubmit, text1, text2, checkbox1, rightBtn1 } = tab;
  const isActive = id === currTabId;
  if (!isActive) return null;
  const onBackClicked = (e: any) => {
    handleTabChange(e, { value: tab.back });
  };
  const onNextClicked = (e: any) => {
    handleTabChange(e, { value: tab.next });
  };
  const handleSubmit = (e: any) => {
    onSubmitClicked(e).then(() => {
      onNextClicked(e);
    });
  };
  return (
    <TabTemplate
      isActive={isActive}
      title={title}
      actions={
        <>
          <LeftBtn onClick={onBackClicked} content="Back" />
          <RightBtn
            onClick={shouldSubmit ? handleSubmit : onNextClicked}
            loading={isSubmitting}
            disabled={!isAgreed}
            content={rightBtn1}
          />
        </>
      }
      content={
        <Form>
          <div style={{ marginBottom: '20px' }}>{text1}</div>
          {text2 && <div style={{ marginBottom: '20px' }}>{text2}</div>}
          <Form.Checkbox label={checkbox1} checked={isAgreed} onChange={handleAgreeCheckBoxChange} />
        </Form>
      }
    />
  );
}
export default SubmitForFinalDecisionTab;
