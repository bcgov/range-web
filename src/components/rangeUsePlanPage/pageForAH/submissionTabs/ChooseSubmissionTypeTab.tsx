import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { PLAN_STATUS } from '../../../../constants/variables';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';

interface ChooseSubmissionTypeTabProps {
  currTabId: string;
  statusCode: string | null;
  handleStatusCodeChange: (...args: any[]) => void;
  handleTabChange: (...args: any[]) => void;
  onClose: () => void;
  tab: { id: string; title: string; back?: string; next: string; radio1: string; radio2: string };
}

function ChooseSubmissionTypeTab({
  currTabId,
  tab,
  statusCode,
  handleStatusCodeChange,
  onClose,
  handleTabChange,
}: ChooseSubmissionTypeTabProps) {
  const { id, title, back, radio1, radio2 } = tab;
  const isActive = id === currTabId;
  if (!isActive) return null;
  const onBackClicked = (e: any) => {
    handleTabChange(e, { value: back });
  };
  const onNextClicked = (e: any) => {
    handleTabChange(e, { value: tab.next });
  };
  return (
    <TabTemplate
      isActive={isActive}
      title={title}
      actions={
        <>
          <LeftBtn onClick={back ? onBackClicked : onClose} content={back ? 'Back' : 'Cancel'} />
          <RightBtn onClick={onNextClicked} disabled={!statusCode} content="Next" />
        </>
      }
      content={
        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={statusCode || ''} onChange={(e) => handleStatusCodeChange(e, { value: e.target.value })}>
            <div className="rup__multi-tab__radio-field">
              <FormControlLabel
                value={PLAN_STATUS.SUBMITTED_FOR_REVIEW}
                control={<Radio checked={statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW} />}
                label={
                  <label>
                    <b>Submit for Staff Feedback: </b>
                    {radio1}
                  </label>
                }
              />
            </div>
            <div className="rup__multi-tab__radio-field">
              <FormControlLabel
                value={PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION}
                control={<Radio checked={statusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION} />}
                label={
                  <label>
                    <b>Submit for Final Decision: </b>
                    {radio2}
                  </label>
                }
              />
            </div>
          </RadioGroup>
        </FormControl>
      }
    />
  );
}
export default ChooseSubmissionTypeTab;
