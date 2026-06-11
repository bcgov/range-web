import React from 'react';
import { Radio, Form as SUIForm } from 'semantic-ui-react';
const Form = SUIForm as any;
import { CONFIRMATION_OPTION } from '../../../../constants/variables';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';
import AHConfirmationList from './AHConfirmationList';

interface ConfirmChoiceTabProps { user: any; onClose: () => void; plan: any; clients: any[]; clientAgreements: any[]; currTabId: string; confirmationOption: string | null; isAgreed: boolean; isConfirming: boolean; handleSubmissionChoiceChange: (...args: any[]) => void; handleAgreeCheckBoxChange: (...args: any[]) => void; handleConfirmation: (...args: any[]) => any; handleTabChange: (...args: any[]) => void; tab: { id?: string; title?: string; next?: string; radio1?: string; radio2?: string }; }

const ConfirmChoiceTab: React.FC<ConfirmChoiceTabProps> = (props) => {
  const { user, clients, clientAgreements, plan, currTabId, tab, confirmationOption, isAgreed, isConfirming, handleSubmissionChoiceChange, handleAgreeCheckBoxChange, onClose, handleConfirmation, handleTabChange } = props;
  const { id, title, radio1, radio2 } = tab;
  const isActive = id === currTabId;
  if (!isActive) return null;
  const onNextClicked = (e?: any) => { handleTabChange(e, { value: tab.next }); };
  const doConfirmation = (e: any) => { handleConfirmation(e).then(() => { onNextClicked(); }); };
  let isConfirmBtnDisabled = confirmationOption === null;
  if (confirmationOption === CONFIRMATION_OPTION.CONFIRM) { isConfirmBtnDisabled = !isAgreed; }
  return (
    <TabTemplate isActive={isActive} title={title || ''}
      actions={<><LeftBtn onClick={onClose} content="Cancel" /><RightBtn onClick={confirmationOption === CONFIRMATION_OPTION.REQUEST ? onNextClicked : doConfirmation} loading={isConfirming} disabled={isConfirmBtnDisabled} content="Confirm" /></>}
      content={<Form><Form.Field className="rup__multi-tab__radio-field"><Radio className="rup__multi-tab__radio" label={<label><b>Confirm and send for final decision: </b>{radio1}</label>} name="radioGroup" value={CONFIRMATION_OPTION.CONFIRM} checked={confirmationOption === CONFIRMATION_OPTION.CONFIRM} onChange={handleSubmissionChoiceChange} /></Form.Field><Form.Field className="rup__multi-tab__radio-field"><Radio className="rup__multi-tab__radio" label={<label><b>Request clarification or changes: </b>{radio2}</label>} name="radioGroup" value={CONFIRMATION_OPTION.REQUEST} checked={confirmationOption === CONFIRMATION_OPTION.REQUEST} onChange={handleSubmissionChoiceChange} /></Form.Field><AHConfirmationList user={user} clients={clients} plan={plan} clientAgreements={clientAgreements} /><Form.Checkbox label="I understand that this submission constitues a legal document and eSignature. This submission will be reviewed by the range staff before it is forwarded to the decision maker." checked={isAgreed} style={{ marginTop: '20px' }} disabled={confirmationOption !== CONFIRMATION_OPTION.CONFIRM} onChange={handleAgreeCheckBoxChange} /></Form>}
    />
  );
};
export default ConfirmChoiceTab;
