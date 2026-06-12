import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import { CONFIRMATION_OPTION } from '../../../../constants/variables';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';
import AHConfirmationList from './AHConfirmationList';

interface ConfirmChoiceTabProps {
  user: any;
  onClose: () => void;
  plan: any;
  clients: any[];
  clientAgreements: any[];
  currTabId: string;
  confirmationOption: string | null;
  isAgreed: boolean;
  isConfirming: boolean;
  handleSubmissionChoiceChange: (...args: any[]) => void;
  handleAgreeCheckBoxChange: (...args: any[]) => void;
  handleConfirmation: (...args: any[]) => any;
  handleTabChange: (...args: any[]) => void;
  tab: { id?: string; title?: string; next?: string; radio1?: string; radio2?: string };
}

function ConfirmChoiceTab(props: ConfirmChoiceTabProps) {
  const {
    user,
    clients,
    clientAgreements,
    plan,
    currTabId,
    tab,
    confirmationOption,
    isAgreed,
    isConfirming,
    handleSubmissionChoiceChange,
    handleAgreeCheckBoxChange,
    onClose,
    handleConfirmation,
    handleTabChange,
  } = props;
  const { id, title, radio1, radio2 } = tab;
  const isActive = id === currTabId;
  if (!isActive) return null;
  const onNextClicked = (e?: any) => {
    handleTabChange(e, { value: tab.next });
  };
  const doConfirmation = (e: any) => {
    handleConfirmation(e).then(() => {
      onNextClicked();
    });
  };
  let isConfirmBtnDisabled = confirmationOption === null;
  if (confirmationOption === CONFIRMATION_OPTION.CONFIRM) {
    isConfirmBtnDisabled = !isAgreed;
  }
  return (
    <TabTemplate
      isActive={isActive}
      title={title || ''}
      actions={
        <>
          <LeftBtn onClick={onClose} content="Cancel" />
          <RightBtn
            onClick={confirmationOption === CONFIRMATION_OPTION.REQUEST ? onNextClicked : doConfirmation}
            loading={isConfirming}
            disabled={isConfirmBtnDisabled}
            content="Confirm"
          />
        </>
      }
      content={
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={confirmationOption || ''}
            onChange={(e) => handleSubmissionChoiceChange(e, { value: e.target.value })}
          >
            <div className="rup__multi-tab__radio-field">
              <FormControlLabel
                value={CONFIRMATION_OPTION.CONFIRM}
                control={<Radio checked={confirmationOption === CONFIRMATION_OPTION.CONFIRM} />}
                label={
                  <label>
                    <b>Confirm and send for final decision: </b>
                    {radio1}
                  </label>
                }
              />
            </div>
            <div className="rup__multi-tab__radio-field">
              <FormControlLabel
                value={CONFIRMATION_OPTION.REQUEST}
                control={<Radio checked={confirmationOption === CONFIRMATION_OPTION.REQUEST} />}
                label={
                  <label>
                    <b>Request clarification or changes: </b>
                    {radio2}
                  </label>
                }
              />
            </div>
          </RadioGroup>
          <AHConfirmationList user={user} clients={clients} plan={plan} clientAgreements={clientAgreements} />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAgreed}
                disabled={confirmationOption !== CONFIRMATION_OPTION.CONFIRM}
                onChange={(e) => handleAgreeCheckBoxChange(e, { checked: e.target.checked })}
              />
            }
            label="I understand that this submission constitues a legal document and eSignature. This submission will be reviewed by the range staff before it is forwarded to the decision maker."
            style={{ marginTop: '20px' }}
          />
        </FormControl>
      }
    />
  );
}
export default ConfirmChoiceTab;
